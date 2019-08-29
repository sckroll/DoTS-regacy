const express = require('express')
const router = express.Router()
const Data = require('../models/crawled-data')

// 사용할 검색 엔진
const SEARCH_ENG = 'google'

router.get('/', function(req, res, next) {
	Data.findAll()
		.then(result => {
			res.send(result)
		})
		.catch(err => {
			throw err
		})
})

router.get('/delete', function(req, res, next) {
	Data.deleteMany({})
		.then(result => {
			res.send(result)
		})
		.catch(err => {
			throw err
		})
})

router.post('/add', function(req, res, next) {
	// 레벨을 node.js 상에서 계산, 파이썬으로 URL과 함께 전달

	Data.findOneByUrl(req.body.currURL)
		.then(result => {
			if (!result) {
				// selenium 실행을 위해 현재 URL, 이전 URL, 레벨을 인수로 전달
				// 인수로 전달 시 작은 따옴표로 묶어서 전달할 것
				// getCrawledData(currURL, prevURL, level);

				// 파이썬에서 크롤링한 데이터를 DB에서 불러왔다고 가정
				// 레벨 1: URL에 google이 포함되어 있는 경우
				// 레벨 2 이후: 그 외의 모든 URL, 호스트 주소 이후의 노드 개수에 따라 레벨 증가 (정규표현식 사용)
				var parsedUrl = require('url').parse(req.body.currURL)
				var hostname = parsedUrl.hostname
				var paths = [hostname]
				var pathnames
				var level

				console.log(parsedUrl)
				// 우선 호스트 주소가 타당한지 검사
				if (hostname && parsedUrl.protocol) {
					if (hostname.indexOf('www.' + SEARCH_ENG) != -1) {
						level = 1

						var query = require('querystring').parse(parsedUrl.query)
						if (query.q) {
							paths.push(query.q)
						}
					} else {
						pathnames = parsedUrl.pathname.match(
							/\/([a-z0-9-~%@#_.!]{1,})/gi || []
						)

						if (pathnames) {
							level = pathnames.length + 2
							paths = paths.concat(pathnames)
						} else {
							level = 2
						}
					}

					var newUserData = new Data({
						user_email: req.body.userEmail,
						user_name: req.body.userName,
						prev_url: req.body.prevURL,
						curr_url: req.body.currURL,
						level,
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
					// URL 형태가 아닐 경우
					res.send({ notUrl: true })
				}
			} else {
				res.send(result)
			}
		})
		.catch(err => {
			throw err
		})
})

module.exports = router
