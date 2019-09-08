const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
// const Data = require('../models/crawled-data')
const schema = require('../models/crawled-data')

var Data = {}

// 사용할 검색 엔진
const SEARCH_ENG = 'google'

router.get('/', function(req, res, next) {
	Data = mongoose.model('CrawledData', schema, `${req.query.name}_data`)

	Data.findAll()
		.then(result => {
			res.send(result)
		})
		.catch(err => {
			throw err
		})
})

router.post('/add', function(req, res, next) {
	var parsedUrl = require('url').parse(req.body.currURL)
	var hostname = parsedUrl.hostname
	var paths = [hostname]
	var level
	var parentId = req.body.parentId
	console.log(parsedUrl)

	// 우선 호스트 주소가 타당한지 검사
	var isCrawlable = true
	var isMainPage = false
	if (hostname && parsedUrl.protocol) {
		if (hostname.indexOf('www.' + SEARCH_ENG) != -1) {
			// 레벨 1일 경우
			level = 1

			var query = require('querystring').parse(parsedUrl.query)
			if (query.q) {
				paths.push(query.q)
			} else {
				// URL에 google이 포함되어 있는 경우
				// Google 메인 홈페이지는 크롤링 대상이 아니므로 DB에 추가하지 않음
				isCrawlable = false
				isMainPage = true
			}
		} else {
			// 레벨 2 이상일 경우
			// 정규표현식을 사용하여 path를 구분
			var pathnames = parsedUrl.pathname.match(
				/\/([a-z0-9-~%@#_.!]{1,})/gi || []
			)

			if (pathnames) {
				level = req.body.parentLevel + 1
				paths = paths.concat(pathnames)
			} else {
				level = 2
			}
		}
	} else {
		// URL 형태가 아닐 경우
		isCrawlable = false
	}

	if (isCrawlable) {
		// 이 부분에서 파이썬(Selenium) 연동

		// selenium 실행을 위해 JSON으로 묶어서 인수로 전달
		// const newUserData = {
		// 	user_email: req.body.userEmail,
		// 	user_name: req.body.userName,
		// 	keyword: '',
		// 	sub_keyword: [],
		// 	marked: [],
		// 	prev_url: req.body.prevURL,
		// 	curr_url: req.body.currURL,
		// 	level,
		// 	parent_id: parentId,
		// 	paths
		// }

		// var pythonShell = require('python-shell');
		// var file = '../../JMH/Selenium/search.py';
		// var options = {
		// 	mode: 'json',
		// 	pythonPath: 'python',
		// 	pythonOptions: ['-u'],
		// 	scriptPath: '',
		// 	encoding: 'utf8',
		// 	args: [newUserData]
		// };

		// pythonShell.PythonShell.run(file, options, function(err, result) {
		// 	if(err) throw err;

		// 	console.log(result);
		// 	res.send(result)
		// });

		Data.findOneByUrl(req.body.currURL)
			.then(result => {
				if (!result) {
					var newUserData = new Data({
						user_email: req.body.userEmail,
						user_name: req.body.userName,
						keyword: 'mainKeyword',
						sub_keyword: ['subKeyword1', 'subKeyword2'],
						marked: [],
						prev_url: req.body.prevURL,
						curr_url: req.body.currURL,
						level,
						parent_id: parentId,
						paths
					})
					Data.create(newUserData)
						.then(result => {
							res.send(result)
						})
						.catch(err => {
							res.send(err)
						})
				} else {
					res.send(result)
				}
			})
			.catch(err => {
				throw err
			})
	} else {
		res.send({ notUrl: true, isMainPage, level, paths })
	}
})

router.delete('/', function(req, res, next) {
	Data.deleteMany({})
		.then(result => {
			res.send(result)
		})
		.catch(err => {
			throw err
		})
})

router.delete('/:name', function(req, res, next) {
	mongoose.connection
		.dropCollection(`${req.params.name}_data`)
		.then(result => {
			res.send(result)
		})
		.catch(err => {
			throw err
		})
})

module.exports = router
