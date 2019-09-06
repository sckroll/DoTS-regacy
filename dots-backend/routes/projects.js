const express = require('express')
const router = express.Router()
const Project = require('../models/projects')
// const User = require('../models/users')

router.get('/', function(req, res, next) {
	// Project.findAll()
	// 	.then(result => {
	// 		res.send(result)
	// 	})
	// 	.catch(err => {
	// 		throw err
	// 	})
	Project.findByMember(req.query.email)
		.then(result => {
			res.send(result)
		})
		.catch(err => {
			throw err
		})
})

router.get('/current', function(req, res, next) {
	var project_id = req.query.id

	Project.findOneById(project_id)
		.then(result => {
			res.send(result)
		})
		.catch(err => {
			throw err
		})
})

// 특정 프로젝트의 정보를 조회 (존재한다면 프로젝트 ID를 반환)
// 우선은 프로젝트 ID를 랜덤 문자열로 하지만, 이미 존재하는 ID와 충돌할 경우 어떻게 할 것인가?
router.get('/find', function(req, res, next) {
	Project.findOneById(req.query.id)
		.then(result => {
			if (result) {
				// 중복되는 ID가 있는 경우
				res.send(result)
			} else {
				// 중복되는 ID가 없는 경우
				res.send({ id: req.query.id })
			}
		})
		.catch(err => {
			res.send(err)
		})
})

// 새로 생성한 프로젝트의 정보를 DB에 저장
router.post('/create', function(req, res, next) {
	// 중복되는 프로젝트 이름이 존재하는지 검사
	Project.findOneByName(req.body.projectName)
		.then(result => {
			if (!result) {
				// 중복되는 이름이 없다면
				const newProject = new Project({
					project_id: req.body.projectId,
					project_name: req.body.projectName,
					description: req.body.description,
					topic: req.body.topic,
					team_name: req.body.teamName,
					founder_email: req.body.user.email,
					member: []
				})

				const newMember = {
					email: req.body.user.email,
					first_name: req.body.user.firstName,
					last_name: req.body.user.lastName,
					position: '팀장',
					color: req.body.user.color
				}

				newProject.member.push(newMember)

				Project.create(newProject)
					.then(r => {
						console.log('Successed: ' + req.body.projectName)
						res.send(r)
					})
					.catch(e => {
						console.log('Failed: ' + req.body.projectName)
						res.send(e)
					})

				// User.findOneByEmail(req.body.founderEmail)
				// 	.then(value => {
				// 		const newMember = {
				// 			user: value._id,
				// 			position: '팀장'
				// 		}

				// 		newProject.member.push(newMember)

				// 		Project.create(newProject)
				// 			.then(r => {
				// 				console.log('Successed: ' + req.body.projectName)
				// 				res.send(r)
				// 			})
				// 			.catch(e => {
				// 				console.log('Failed: ' + req.body.projectName)
				// 				res.send(e)
				// 			})
				// 	})
				// 	.catch(error => {
				// 		res.send(error)
				// 	})
			} else {
				// 이미 존재하는 프로젝트가 있다면
				throw new Error('이미 해당 프로젝트의 이름이 존재합니다.')
			}
		})
		.catch(err => {
			res.send(err)
		})
})

router.delete('/:name', function(req, res, next) {
	Project.deleteOne({ project_name: req.params.name })
		.then(result => {
			res.send(result)
		})
		.catch(err => {
			throw err
		})
})

module.exports = router
