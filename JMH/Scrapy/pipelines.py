import pymongo

class SearchtutorialPipeline(object):

    def __init__(self):
        self.conn = pymongo.MongoClient (
            'mongodb+srv://dots_user:TzE66c5O0KB0bnjG@dots-test-x41en.mongodb.net/test?retryWrites=true&w=majority',
            27017
        )
        db = self.conn['search']
        self.collections = db['search_table']

    def process_item(self, item, spider):
        self.collections.insert(dict(item))

        # 데이터로 추출되기 전에 파이프라인에 들어있는 문자열 확인
#       print("Pipeline : " + item['title'][0])
        return item
