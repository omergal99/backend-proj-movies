const mongoService = require('./mongo-service')

const ObjectId = require('mongodb').ObjectId;

const USER_COLLECTION = 'users';

function checkLogin({ userNamePass }) {
    const name = userNamePass.name
    const password = userNamePass.pass
    return mongoService.connect()
        .then(db => db.collection(USER_COLLECTION).findOne({ name,password }))
        .then(res => {
            console.log('ressssss',res)
            return res
        })
}

function getById(id) {
    const _id = new ObjectId(id)
    return mongoService.connect()
        .then(db => db.collection(USER_COLLECTION).findOne({ _id }))
}

function query() {
    return mongoService.connect()
        .then(db => db.collection(USER_COLLECTION).find({}).toArray())
}

function addUser({ newUser }) {
    var user = { newUser }
    user.isAdmin = false;
    // todo - add user only if nickname is not taken
    return mongoService.connect()
        .then(db => db.collection(USER_COLLECTION).insertOne(user))
        .then(res => {
            user._id = res.insertedId
            return user
        })
}

module.exports = {
    query,
    getById,
    addUser,
    checkLogin
}