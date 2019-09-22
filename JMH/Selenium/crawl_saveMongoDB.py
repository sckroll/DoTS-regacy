from pymongo import MongoClient

# 몽고 DB에 각종 정보 저장
# def store_mongoDB(user_name, user_email, curr_url, prev_url, pageList, relativeKeywordList, level, parent_id, paths, keyword, sub_keyword, pageContents, screenshot, tagged, nowTime):
#
#     client = MongoClient('mongodb+srv://dots_user:TzE66c5O0KB0bnjG@dots-test-x41en.mongodb.net/test?retryWrites=true&w=majority')
#     db = client['JMH']
#     collection = db['user3']
#
#     crawl_info = {
#         "user_name": user_name,
#         "user_email": user_email,
#         "curr_url": curr_url,
#         "prev_url": prev_url,
#         "pageList": pageList,
#         "relativeKeywordList": relativeKeywordList,
#         "level": int(level),
#         "parent_id": parent_id,
#         "paths": paths,
#         "keyword": keyword,
#         "sub_keyword": sub_keyword,
#         "pageContents": pageContents,
#         "tagged": tagged,
#         "nowTime": nowTime,
#         "screenshot": screenshot,
#     }
#
#     collection.insert_one(crawl_info)


def store_mongoDB(user_name, curr_url, prev_url, relativeKeywordList, level, keyword):
    client = MongoClient('mongodb+srv://dots_user:TzE66c5O0KB0bnjG@dots-test-x41en.mongodb.net/test?retryWrites=true&w=majority')
    db = client['JMH']
    collection = db['user1']

    crawl_info = {
        "user_name": user_name,
        "curr_url": curr_url,
        "prev_url": prev_url,
        "relativeKeywordList": relativeKeywordList,
        "level": int(level),
        "keyword": keyword,
    }

    collection.insert_one(crawl_info)
