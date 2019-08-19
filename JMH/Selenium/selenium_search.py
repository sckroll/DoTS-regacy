import re
import sys
import requests
from datetime import datetime
from pymongo import MongoClient
from selenium import webdriver

chrome_options = webdriver.ChromeOptions() # 크롬 옵션 객체 생성
chrome_options.add_argument('headless') # headless 모드 설정
chrome_options.add_argument("--disable-gpu") # gpu 허용 안함
chrome_options.add_argument("lang=ko_KR") # 한국어 설정

# User-Agent 설정
chrome_options.add_argument(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"
)

driver = webdriver.Chrome('C:\chromedriver_win32\chromedriver.exe', chrome_options=chrome_options)
driver.implicitly_wait(3)

# 프론트엔드에서 사용자가 키워드를 입력하거나 페이지를 옮기면서 url이 변할 경우
# 메인 함수에 url이 인자로 들어옴(이전 페이지, 현재 페이지)
def main():

    # url을 응답해서 그 url에 맞는 크롤링 방식 채택
    # 몽고 DB에 들어갈 속성 : 키워드, 현재 페이지, 이전 페이지, 페이지 리스트, 레벨, 서브 키워드
    currUrl = sys.argv[2]
    prevUrl = sys.argv[1]

    pageList = []
    level = 0
    subkeyword = []
    nowTime = ''

    default_page = 'https://www.google.com/'
    search_page = 'https://www.google.com/search?'

    currUrl = currUrl.replace("'", "")
    prevUrl = prevUrl.replace("'", "")

    ############################################ 크롤링 시작 ############################################
    # 만약 현재 페이지가 새 탭으로 넘어가거나 키워드가 없는 검색창인 경우
    if currUrl == default_page:
        print('==============검색창인 경우==============')
        keyword = '기본 단어'
        currUrl = currUrl
        prevUrl = prevUrl
        pageList = ['www.naver.com', 'www.daum.net']
        level = 0
        subkeyword = ['hello', 'world']
        nowTime = datetime.now()
    #
    # # 만약 현재 페이지가 키워드를 입력하고 난 검색 페이지인 경우
    # # 키워드, url 리스트 추출
    # elif search_page in currUrl:
    #     print('검색 페이지인 경우')
    #     keyword = parseKeyword(currUrl)
    #     currUrl = currUrl
    #     prevUrl = prevUrl
    #     pageList = parsePageList(currUrl)
    #     level = 1
    #     subkeyword = []
    #     nowTime = datetime.now()
    #
    # # 만약 현재 페이지가 홈페이지인 경우(레벨 2)
    # # 현재 url, 서브 키워드 추출
    # else:
    #     print('홈페이지인 경우')
    #     keyword = parseKeyword(prevUrl)
    #     currUrl = currUrl
    #     prevUrl = prevUrl
    #     pageList = []
    #     level = 2
    #     subkeyword = parseSubKeyword(currUrl)
    #     nowTime = datetime.now()

    # 만약 현재 페이지가 홈페이지인 경우(레벨 3 ~ )


    # 추출된 아이템들을 몽고 DB에 저장
    print('추출된 아이템들 몽고 DB로 저장하기')
    store_mongoDB(keyword, prevUrl, currUrl, pageList, level, subkeyword, nowTime)

    return 0

# 키워드 추출 함수(검색창인 경우에만)
def parseKeyword(response):
    keyword = response.css('.gsfi::attr(value)').extract()
    yield keyword

# 서브 키워드 추출 함수
def parseSubKeyword(response):
    subkeyword = response.css('p::text').extract()
    yield subkeyword

# 페이지 url 추출 함수
def parsePageUrl(response):
    pageUrl = response.xpath('//link[@rel="canonical"]/@href').extract_first()
    yield pageUrl

# 페이지 리스트 추출 함수
def parsePageList(response):
    pageList = response.css('.iUh30::text').extract()
    yield pageList

# 정규화(연결되어 있는 공백을 하나의 공백으로 변경하고 삭제)
def normalize_spaces(s) :

    return re.sub(r'\s+', ' ', s).strip()

# 몽고 DB에 각종 정보 저장
def store_mongoDB(keyword, prevUrl, currUrl, pageList, level, subkeyword, nowTime):
    print("몽고 DB에 저장 중...")

    client = MongoClient(
        'mongodb+srv://dots_user:TzE66c5O0KB0bnjG@dots-test-x41en.mongodb.net/test?retryWrites=true&w=majority')
    db = client['Project']
    collection = db['JMH']

    crawl_info = {
        "키워드": keyword,
        "이전 페이지": prevUrl,
        "현재 페이지": currUrl,
        "페이지 리스트": pageList,
        "레벨": level,
        "서브 키워드": subkeyword,
        "현재 시간": nowTime,
    }

    print(crawl_info)

    collection.insert_one(crawl_info)

    print("몽고 DB에 저장 완료!")

if __name__ == '__main__':
    main()