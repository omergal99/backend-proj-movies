const mongoService = require('./mongo-service')

const ObjectId = require('mongodb').ObjectId;


function addReview({ user, movie, content }) {
    // console.log('im heeeer')
    var review = {
        content: {
            txt: content.txt,
            publishedAt: new Date(),
            comments: "",
            img: "",
            link: ""
        },
        user: {
            userId: new ObjectId(user.userId),
            userImg: user.userImg,
            userName: user.userName
        },
        movie: {
            movieId: new ObjectId(movie.movieId),
            movieImg: movie.movieImg,
            movieName: movie.movieName
        },
        rate: {
            countLike: [],
            countDislike: []
        }

    }

    return mongoService.connect()
        .then(db => db.collection('reviews').insertOne(review))
        // .then (({insertedId: _id}) => ({...review, _id}))
        .then(res => {
            review._id = res.insertedId;
            return review
        })
}



function getReviewsByDirect(direct, id) {
    var byId = new ObjectId(id)
    if (direct === 'user') {
        return mongoService.connect()
            .then(db => db.collection('reviews')
                .aggregate([
                    {
                        $match: { "user.userId": byId }
                    },
                    {
                        $lookup:
                        {
                            from: 'movies',
                            localField: "movie.movieId",
                            foreignField: '_id',
                            as: 'curmovie'
                        }
                    },
                ]).toArray()
            )
    }
    else if (direct === 'movie') {
        return mongoService.connect()
            .then(db => db.collection('reviews').find({ "movie.movieId": byId }).toArray())
    }
}

function updateReviewTxt(reviewId, txt) {
    rev_id = new ObjectId(reviewId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('reviews');
            return collection.updateOne({ _id: rev_id }, { $set: { "content.txt": newTxt } })
                .then(result => {
                    return result;
                })
        })
}

function updateReviewRate(reviewId, logedInuserId, rateDitection) {
    rev_id = new ObjectId(reviewId)
    user_id = new ObjectId(logedInuserId)
    if (rateDitection == 'like') {
        return mongoService.connect()
            .then(db => {
                const collection = db.collection('reviews');
                return collection.updateOne(
                    { "_id": rev_id },
                    {
                        $push: {
                            "rate.countLike": user_id
                        }
                    }
                )
                    .then(result => {
                        return reviewId;
                    })
            })
    }
    else {
        return mongoService.connect()
            .then(db => {
                const collection = db.collection('reviews');
                return collection.update(
                    { "_id": rev_id },
                    {
                        $push: {
                            "rate.countDislike": user_id
                        }
                    }
                )
            })
    }
}


function removeReview(reviewId) {
    reviewId = new ObjectId(reviewId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('reviews');
            return collection.deleteOne({ _id: reviewId })
        })
}

module.exports = {
    // query,
    // getUserReviews,
    addReview,
    getReviewsByDirect,
    updateReviewTxt,
    removeReview,
    updateReviewRate
}