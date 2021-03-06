const userService = require('../services/user-service')
//const reviewService = require('../services/review-service')
const BASE = '/user'

function addRoutes(app) {
    
    // LIST OF USERS
    app.get(BASE, (req, res) => {
        userService.query()
            .then(users => res.json(users))
    })

    app.get(`${BASE}/logout`, (req, res) => {
        req.session.destroy();
        res.json({});
    });

    // ONE USER BY ID
    app.get(`${BASE}/:userId`, (req, res) => {
        const userId = req.params.userId
        userService.getById(userId)
            .then((user) => {
                res.json(user)
            })
    })

    app.post(`${BASE}/singup`, (req, res) => {
        const userNamePass = req.body
        //console.log('userNamePass', userNamePass)
        userNamePass.name.toLowerCase()
        userService.addUser(userNamePass)
        .then(user => {
            req.session.loggedInUser = user
            res.json(user)
        })
})

    app.put(`${BASE}/login`, (req, res) => {
        const userNamePass = req.body
        userService.checkLogin({ userNamePass })
            .then(user => {
                req.session.loggedInUser = user
                res.json(user)
            })
    })

    app.put(`${BASE}/details/:userId`, (req, res) => {
        const users = req.body
        console.log('users-backeng router:', users)
        userService.addFollowUser(users)
    })

    app.put(`${BASE}/:userId`, (req, res)=>{
        const userAndImg=req.body
       console.log('Natalia img ',userAndImg )
        userService.updateImg(userAndImg)
        .then(user => res.json(user))
    })
}

module.exports = addRoutes;