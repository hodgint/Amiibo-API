const router = require('express').Router();
const objectId = require('mongodb').objectId;
const bcyrpt = require('bcryptjs');

const { generateAuthToken, requireAuthentication} = require('../lib/auth');
const {getUserAmiiboByList} = require('./amiibo');

function validateUserObject(user){
    console.log("Validate User id: " + user.userID);
    return user && user.username && user.userID && user.email && user.password;
}

function addUser(user, mongoDB){
    console.log("addUser id: " + user.userID);
    return bcyrpt.hash(user.password, 8) 
    .then((passwordHash) => {
        const userDocument = {
            userID: user.userID,
            username: user.username,
            email: user.email,
            password: passwordHash
        }
        var userCollection = mongoDB.collection('users');
        return userCollection.insertOne(userDocument);
    })
    .then((result) =>{
        return Promise.resolve(result.insertedId);
    });
}

function getUserById(userID, mongoDB, includePassword){
    const userCollection = mongocDB.collection('users');
    const projection = includePassword ? {} : {Password: 0};
    return userCollection
    .find({userID: userId})
    .project(projection)
    .toArray()
    .then((results) => {
        return Promise.resolve(results[0]);
    });
}

function getUserByUsername(Username, mongoDB, includePassword){
  const userCollection = mongocDB.collection('users');
  const projection = includePassword ? {} : {Password: 0};
  return userCollection
  .find({Username: username})
  .project(projection)
  .toArray()
  .then((results) => {
      return Promise.resolve(results[0]);
  });
}

//router.get('/:userID/amiibo', requierAuthentication, function(req, res){
  //  const mysqlPool = req.app.locals.mysqlPool;
   // const userID = parseInt(req.params.userID);
//})


router.post('/', function(req, res){
    const mongoDB = req.app.locals.mongoDB;
    if(validateUserObject(req.body)){
        console.log(req.body);
        addUser(req.body, mongoDB)
        .then((id) => {
            res.status(201).json({
                _id: id,
                links:{
                    user: '/users/' + id
                }
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: "Failed to insert new user. " + err
            });
        });
    } else{
        res.status(400).json({
            error: "Request doesn't contain a vlaid user."
        });
    }
});

router.post('/login', function(req, res){
    const mongoDB = req.app.locals.mongoDB;
    if (req.body && req.body.userID && req.body.password) {
      getUserByID(req.body.userID, mongoDB, true)
        .then((user) => {
          console.log(user);

          if (user){
            return bcrypt.compare(req.body.password, user.password);
          } else {
            return Promise.reject(401);
          }
        })
        .then((loginSuccessful) => {
          if (loginSuccessful) {
            return generateAuthToken(req.body.userID);
          } else {
            return Promise.reject(401);
          }
        })
        .then((token) => {
          res.status(200).json({
            token: token
          });
        })
        .catch((err) => {
          console.log(err);
          if (err === 401) {
            res.status(401).json({
              error: "Invalid credentials."
            });
          } else {
            res.status(500).json({
              error: "Failed to fetch user."
            });
          }
        });
    } else {
      res.status(400).json({
        error: "Request needs a user ID and password."
      })
    }
  });

exports.router = router;