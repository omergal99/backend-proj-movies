const mongoService = require('./mongo-service')

const ObjectId = require('mongodb').ObjectId;

const USER_COLLECTION = 'users';

function checkLogin({ userNamePass }) {
    const name = userNamePass.name
    const password = userNamePass.pass
    return mongoService.connect()
        .then(db => db.collection(USER_COLLECTION).findOne({ name, password }))
        .then(res => {
           // console.log('ressssss', res)
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

function addUser(userNamePass) {
    var userName = userNamePass.name
    var user = {
        name: userNamePass.name,
        email: "",
        userImg: "https://img.icons8.com/doodle/48/000000/user.png",
        password: userNamePass.pass,
        isAdmin: false,
        dateCreated: new Date(),
        rating: 0,
        follow: {
            followedBy: [],
            followAfter: []
        },
        gender: 'male'
    }
       return mongoService.connect()
        .then(db => db.collection(USER_COLLECTION).updateOne(
            { name: userName },
            {
                $set: user
            },
            { upsert: true }))
        .then(res => {
            //console.log('res....', res)
            user._id = res.upsertedId._id
            return user
        })
       
}




module.exports = {
    query,
    getById,
    addUser,
    checkLogin,
}