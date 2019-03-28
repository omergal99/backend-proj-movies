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

    //get reviews per user/ movie 
    app.get(`${BASE}/:direct/:id`, (req, res) => {
        const direct = req.params.direct
        const id = req.params.id
        console.log('direct', direct, id)
        reviewService.getReviewsByDirect(direct, id)
            .then(reviews => {
                res.json(reviews)
            })
    })

    // update rate of review => add likes/dislikes
    app.put(BASE, (req, res) => {
        const reviewId = req.body.reviewId;
        const logedInuserId = req.body.updateUser;
        const rateDitection = req.body.rateDitection;
        console.log('direction', reviewId, logedInuserId, rateDitection)
        reviewService.updateReviewRate(reviewId, logedInuserId, rateDitection)
            .then(review => res.json(review))
    })

    //update txt of the review
    app.put(`${BASE}/:reviewId`, (req, res) => {
        const reviewId = req.body.id;
        const newTxt = req.body.txt;
        console.log('direction', reviewId, newTxt)
        reviewService.updateReviewTxt(reviewId, newTxt)
            .then(review => res.json(review))
    })

    //delete review
    app.delete(`${BASE}/:reviewId`, (req, res) => {
        const reviewId = req.params.reviewId;
        reviewService.removeReview(reviewId)
            .then(() => res.json(reviewId ))
    })
}

module.exports = addRoutes;