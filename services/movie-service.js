const mongoService = require('./mongo-service')

const ObjectId = require('mongodb').ObjectId;


// function query() {
//     return mongoService.connect()
//         .then(db => {
//             const collection = db.collection('movies');
//             return collection.find({}).toArray()
//         })
// }

function query(query) {
    var queryToMongo = {}
    // var name = 't'
    // var queryToMongo = {
    //     'details.name' : { '$regex': name },
    //     'details.year' : '1994'
    // }

    if (query.name) {
        let regExpFromTxt = new RegExp(query.name, 'i')
        queryToMongo['details.name'] = { '$regex': regExpFromTxt }
    }
    if (query.category) queryToMongo['details.category'] = query.category

    //  console.log('querytomongo',queryToMongo )
    return mongoService.connect()
        .then(db => {
            return db.collection('movies').find(queryToMongo).toArray()
        })
        .then(movies => {
            var moviesTodisplay = movies.map(movie => {
                movie.avgRank = movie.rank.length===0? 0 : (((movie.rank.reduce((acc, rank) => acc + rank.rank, 0))/ movie.rank.length).toFixed(1))
                return movie
            })
            //   console.log('MOVIES ----------', moviesTodisplay)
            return moviesTodisplay
        })
}


function remove(movieId) {
    movieId = new ObjectId(movieId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('movies');
            return collection.remove({ _id: movieId })
        })
}

function getById(movieId) {
    movieId = new ObjectId(movieId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('movies');
            return collection.findOne({ _id: movieId })
        })
}

function add(movie) {
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('movies');
            return collection.insertOne(movie)
                .then(result => {
                    movie._id = result.insertedId;
                    return movie;
                })
        })
}

function update(movie) {
    movie._id = new ObjectId(movie._id)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('movies');
            return collection.updateOne({ _id: movie._id }, { $set: movie })
                .then(result => {
                    return movie;
                })
        })
}
function updateMovieRate(movieId, rate, userId) {
    var newValue = {
        userId,
        rank: rate
    }
    movie_id = new ObjectId(movieId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('movies');
            return collection.updateOne(
                { "_id": movie_id },
                {
                    $push: {
                        rank: newValue
                    }
                }
            )
                .then(result => {
                    return movieId;
                })
        })
}


module.exports = {
    query,
    remove,
    getById,
    add,
    update,
    updateMovieRate
}
