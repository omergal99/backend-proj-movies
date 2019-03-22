const userService = require('../services/user-service')
const reviewService = require('../services/review-service')
const BASE = '/user'

function addRoutes(app) {
    app.get(BASE, (req, res) => {
        userService.query()
            .then(users => res.json(users))
    })
    app.get(`${BASE}/:id`, (req, res) => {
        const userId = req.params.id
        Promise.all([
            userService.getById(userId),
            reviewService.query({ userId })
        ])
            .then(([user, reviews]) => {
                console.log({ user })
                res.json({ user, reviews })
            })
    })

    app.post('/singup', (req, res) => {
        const nickname = req.body.nickname
        userService.addUser({ nickname })
            .then(user => res.json(user))
    })

    app.put('/login', (req, res) => {
        const nickname = req.body.nickname
        userService.checkLogin({ nickname })
            .then(user => {
                req.session.user = user
                res.json(user)
            })
    })

}


module.exports = addRoutes;