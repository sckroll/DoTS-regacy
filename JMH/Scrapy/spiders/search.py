import scrapy
from ..items import SearchtutorialItem

class SearchSpider(scrapy.Spider):

    name = 'search'
    start_url = ['https://www.google.com/search']
    allowed_domains = ['www.google.com']
    prevUrl = ''
    currUrl = ''

    # if 시작 버튼 누르면
    #     if 사용자가 키워드 입력후, 페이지 변환 시(Level 0)
    #         keywordParse()
    #         parsePageList()
    #         currUrl = parsePageUrl()

    # def parse(self):
    #
    #     # 검색 페이지인 경우
    #     if currUrl == 'https://www.google.com/search?q' + :
    #         yield ''
    #     if currUrl == '':
    #
    #     if currUrl == '':


    # 키워드 추출 함수(검색창인 경우에만)
    def parseKeyword(self, response):
        keyword = response.css('.gsfi::attr(value)').extract()
        yield keyword

    # 페이지 url 추출 함수
    def parsePageUrl(self, response):
        pageUrl = response.xpath('//link[@rel="canonical"]/@href').extract_first()
        yield pageUrl

    # 페이지 리스트 추출 함수
    def parsePageList(self, response):
        pageList = response.css('.iUh30::text').extract()
        yield pageList

    # 본문 내용 추출 함수
    def parseContents(self, response):
        contents = response.css('p::text').extract()
        print(contents)
