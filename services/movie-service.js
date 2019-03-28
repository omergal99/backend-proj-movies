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

    if (query.name) queryToMongo['details.name'] = { '$regex': query.name }
    if (query.category) queryToMongo['details.category'] = query.category

    // var name = query.name
    // console.log('queryquery',query)
    // if (name) queryToMongo.name = { '$regex': name }
    // if(query.details.category) queryToMongo.category = query.details.category

    //if(query.inStock) queryToMongo.inStock = query.inStock
    // OBJECT TO MONGO LOOKS LIKE THIS: {
    //     name: {'$regex': value},
    //     type: value
    // }
    console.log('querytomongo', queryToMongo)
    return mongoService.connect()
        .then(db => {
            return db.collection('movies').find(queryToMongo).toArray()
        })
        .then(movies => {
            // console.log('MOVIES ----------', movies)
            return movies
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
function updateMovieRate(movieId, rate) {
    movie_id = new ObjectId(movieId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('movies');
            return collection.updateOne(
                { "_id": movie_id  },
                {
                    $push: {
                        rank: rate
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
