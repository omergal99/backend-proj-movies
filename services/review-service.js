const mongoService = require('./mongo-service')

const ObjectId = require('mongodb').ObjectId;


function addReview({ user, movie, content }) {
    console.log('im heeeer')
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
    console.log('review', review)
    return mongoService.connect()
        .then(db => db.collection('reviews').insertOne(review))
        // .then (({insertedId: _id}) => ({...review, _id}))
        .then(res => {
            review.id = res.insertedId;
            //console.log('review.id',review.id)
            return review
        })

}


// function getUserReviews(userId) {
//     const id = new ObjectId(userId)
//     return mongoService.connect()
//         .then(db =>
//             db.collection('reviews').aggregate([
//                 {
//                     //$match: { user:{userId:id}}
//                     $match: { "user.userId": id } //same as prev row
//                 }
//                 // {
//                 //     $lookup:
//                 //     {
//                 //         from: 'movie',
//                 //         localField: 'movieId',
//                 //         foreignField: '_id',
//                 //         as: 'movie'
//                 //     }
//                 // }, {
//                 //     $unwind: '$movie'
//                 // }
//             ]).toArray()
//         )

// }


function getReviewsByDirect(direct, id) {
    var byId = new ObjectId(id)

    console.log('ID', byId, typeof (byId))
    if (direct == 'user') {

        return mongoService.connect()
            .then(db => db.collection('reviews').find({ "user.userId": byId }).sort({ "rate.countLike.length": -1 }).toArray())
    }
    else if (direct == 'movie') {
        return mongoService.connect()
            .then(db => db.collection('reviews').find({ "movie.movieId": byId }).sort({ "rate.countLike.length": -1 }).toArray())
    }
}

function updateReviewTxt(reviewId, txt) {
    console.log('update txt')
    rev_id = new ObjectId(reviewId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('reviews');
            return collection.updateOne({ _id: rev_id }, { $set: { "content.txt": txt } })
                .then(result => {
                    return result;
                })
        })
}

function updateReviewRate( reviewId,logedInuserId, rateDitection){
    rev_id = new ObjectId(reviewId)
    user_id=new ObjectId(logedInuserId)
    if (rateDitection == 'like'){
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
    else{
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

    
           
// function updateReviewUnlike(id) {
//     rev_id = new ObjectId(reviewId)
//     return mongoService.connect()
//         .then(db => {
//             const collection = db.collection('reviews');
//             return collection.update(
//                 { "_id": rev_id },
//                 {
//                     $push: {
//                         "rate.countUnlike": userId
//                     }
//                 }
//             )
//         })
//     }

function removeReview(reviewId) {
                reviewId = new ObjectId(reviewId)
                return mongoService.connect()
                    .then(db => {
                        const collection = db.collection('reviews');
                        return collection.remove({ _id: reviewId })
                    })
            }



module.exports = {
                // query,
                // getUserReviews,
                addReview,
                getReviewsByDirect,
                updateReviewTxt,
                // updateReviewLike,
                // updateReviewUnlike,
                removeReview,
                updateReviewRate
            }