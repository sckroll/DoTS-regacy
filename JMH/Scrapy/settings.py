BOT_NAME = 'searchtutorial'
SPIDER_MODULES = ['searchtutorial.spiders']
NEWSPIDER_MODULE = 'searchtutorial.spiders'
ROBOTSTXT_OBEY = False

# 크롤링 제한 풀기
# 방법1. user-agent
DOWNLOADER_MIDDLEWARES = {
    'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,
    'scrapy_user_agents.middlewares.RandomUserAgentMiddleware': 400,
}

ITEM_PIPELINES = {
    'searchtutorial.pipelines.SearchtutorialPipeline': 300,
}
