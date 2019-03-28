const imageService = require('../services/image-service')


const mongoService = require('./mongo-service')

const ObjectId = require('mongodb').ObjectId;

const USER_COLLECTION = 'users';

function checkLogin({ userNamePass }) {
    const name = userNamePass.name
    const password = userNamePass.pass
    return mongoService.connect()
        .then(db => db.collection(USER_COLLECTION).findOne({ name, password }))
        .then(res => {
            // console.log('ressssss',res)
            return res
        })
}

function getById(id) {
    // don't delete, it's user image API
    // query = {term: 'male'}
    // imageService.query(query)


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

function addFollowUser(users){
    console.log('users-backeng service:', users)

    var loggedInUserId = users.loggedInUser._id
    var followedUserId = users.followedUser._id
    var loggedInUserName = users.loggedInUser.name
    var followedUserName = users.followedUser.name

    loggedInUserId = new ObjectId(loggedInUserId)
    followedUserId = new ObjectId(followedUserId)

    console.log('loggedInUserId:', loggedInUserId)
    console.log('followedUserId:', followedUserId)
    console.log('loggedInUserName:', loggedInUserName)
    console.log('followedUserName:', followedUserName)

    return mongoService.connect()
        .then((db) => {db.collection(USER_COLLECTION).updateOne(      
            {"_id": loggedInUserId},
            {
                $push: { "follow.followAfter": followedUserName } 
            }
            )

            db.collection(USER_COLLECTION).updateOne(
                {"_id": followedUserId},
                {
                    $push: { "follow.followedBy": loggedInUserName } 
                }
            )
        })
}

module.exports = {
    query,
    getById,
    addUser,
    checkLogin,
    addFollowUser
}