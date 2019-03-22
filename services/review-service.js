const mongoService = require('./mongo-service')

const ObjectId = require('mongodb').ObjectId;


function addReview({ user, movie, content}) {
    var review = {
            content: {
            txt: content.txt,
            publishedAt: new Date(),
            comments: content.comments,
            img: content.img,
            link: content.link
        },
        user: {
            userId: new ObjectId(user._id),
            userImg:user.userImg,
            userName: user.userName
        },
        movie: {
            movieId: new ObjectId(movie._id),
            movieImg:movie.movieImg ,
            movieName:movie.movieName 
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
            return getById(res.insertedId)
        })
}

function getUserReviews(userId) {
    const id = new ObjectId(userId)
    return mongoService.connect()
        .then(db =>
            db.collection('reviews').aggregate([
                {
                    //$match: { user:{userId=id}}
                    $match: { "user.userId":id} //same as prev row
                }
                // {
                //     $lookup:
                //     {
                //         from: 'movie',
                //         localField: 'movieId',
                //         foreignField: '_id',
                //         as: 'movie'
                //     }
                // }, {
                //     $unwind: '$movie'
                // }
            ]).toArray()
        )

}


// function query({ userId = null, movieId = null } = {}) {
//     const criteria = {}
//     if (userId) criteria.userId = new ObjectId(userId)
//     if (movieId) criteria.movieId = new ObjectId(movieId)
//     return mongoService.connect().then(db => {
//         return db.collection('reviews')
//             .aggregate([
//                 {
//                     $match : criteria
//                 },
//                 {
//                     $lookup:
//                     {
//                         from: 'movie',
//                         localField: 'movieId',
//                         foreignField: '_id',
//                         as: 'movie'
//                     }
//                 },
//                 {
//                     $unwind: '$movie'
//                 },
//                 {
//                     $lookup:
//                     {
//                         from: 'user',
//                         localField: 'userId',
//                         foreignField: '_id',
//                         as: 'user'
//                     }
//                 },
//                 {
//                     $unwind: '$user'
//                 }
//             ]).toArray()
//     })
// }




module.exports = {
   // query,
    getUserReviews,
    addReview
}