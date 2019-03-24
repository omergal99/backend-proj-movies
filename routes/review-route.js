const reviewService = require('../services/review-service.js')
const BASE = '/review'


function addRoutes(app) {
    // get all reviews
    app.get(BASE, (req, res) => {
        reviewService.query(req.query)
            .then(reviews => {
                res.json(reviews)
            })
    })
    // add new review
    app.post(BASE, (req, res) => {
        console.log("body", req.body)
        var review = {
            // userId: req.session.userId
            user: req.body.user,
            movie: req.body.movie,
            content: req.body.content
        }
        console.log("recieved data", review)
        reviewService.addReview(review)
            .then(review => res.json(review))
    })

    //get reviews per user/per movie 
    app.get(`${BASE}/:direct/:id`, (req, res) => {
        const direct = req.params.direct
        const id = req.params.id
        console.log('direct', direct, id)
        reviewService.getReviewsByDirect(direct, id)
            .then(reviews => {
                res.json(reviews)
            })
    })
}


module.exports = addRoutes;