const mongoService = require('./mongo-service') 

const ObjectId = require('mongodb').ObjectId;


function query() {
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('movies');
            return collection.find({}).toArray()
        })
}
function query(query) {
    var queryToMongo = {}
    var name = query.name
    console.log('queryquery',query)

    if (name) queryToMongo.name = { '$regex': name }

    if(query.type) queryToMongo.type = query.type
     if(query.inStock) queryToMongo.inStock = query.inStock

    // OBJECT TO MONGO LOOKS LIKE THIS: {
    //     name: {'$regex': value},
    //     type: value
    // }

    return mongoService.connect()
        .then(db => {
            return db.collection('movies').find(queryToMongo).toArray()
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
    console.log('movieId',movieId)
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

module.exports = {
    query,
    remove,
    getById,
    add,
    update
}
