const router = require('express').Router();
const objectId = require('mongodb').objectId;
const bcyrpt = require('bcryptjs');
const {generateAuthToken, requireAuthentication} = require('../lib/auth');
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
            amiibo: [],
            password: passwordHash
        }
        var userCollection = mongoDB.collection('users');
        return userCollection.insertOne(userDocument);
    })
    .then((result) =>{
        return Promise.resolve(result.insertedId);
    });
}

function updateUserAmiiboByUsername(user, amiiboID, mongoDB){
  return new Promise((resolve, reject) => {
    mongoDB.collection('users').updateOne(
      {
        username: user
      },
      {
        $addToSet: {amiibo: amiiboID}
      },
      function(err, res){
        if(err){
          console.log("Error adding amiibo, err: " + err);
          return reject(err);
        }
        resolve(res);
      });
    });
} 

function removeUserAmiiboByUsername(user, amiiboID, mongoDB){
  return new Promise((resolve, reject) => {
    mongoDB.collection('users').updateOne(
      {
        username: user
      },
      {
        $pull: {amiibo: amiiboID}
      },
      function(err, res){
        if(err){
          console.log("Error adding amiibo, err: " + err);
          return reject(err);
        }
        resolve(res);
      });
    });
}

function getUserByID(userID, mongoDB, includePassword){
    const userCollection = mongoDB.collection('users');
    const projection = includePassword ? {} : {Password: 0};
    return userCollection
    .find({userID: userID})
    .project(projection)
    .toArray()
    .then((results) => {
        return Promise.resolve(results[0]);
    });
}

function getUserByUsername(Username, mongoDB, includePassword){
  const userCollection = mongoDB.collection('users');
  const projection = includePassword ? {} : {Password: 0};
  return userCollection
  .find({username: Username})
  .project(projection)
  .toArray()
  .then((results) => {
      return Promise.resolve(results[0]);
  });
}

function getUserByEmail(email, mongoDB, includePassword){
  const userCollection = mongoDB.collection('users');
  const projection = includePassword ? {} : {Password: 0};
  return userCollection
  .find({email: email})
  .project(projection)
  .toArray()
  .then((results) => {
      return Promise.resolve(results[0]);
  });
}


router.post('/', function(req, res){
    const mongoDB = req.app.locals.mongoDB;
    if(validateUserObject(req.body)){
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
                error: "Failed to insert new user."
            });
        });
    } else{
        res.status(400).json({
            error: "Request doesn't contain a vlaid user."
        });
    }
});

router.post('/login', function(req, res){
    var id; 
    const mongoDB = req.app.locals.mongoDB;
    if (req.body && req.body.username && req.body.password) {
      getUserByUsername(req.body.username, mongoDB, true)
        .then((user) => {
          if (user){
            id = user.id;
            return bcyrpt.compare(req.body.password, user.password);
          } else {
            return Promise.reject(401);
          }
        })
        .then((loginSuccessful) => {
          if (loginSuccessful) {
            return generateAuthToken(id);
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
          if (err === 401) {
            res.status(401).json({
              error: "Invalid credentials."
            });
          } else {
            res.status(500).json({
              error: "Failed to fetch user.",
              err: err
            });
          }
        });
    } else {
      res.status(400).json({
        error: "Request needs a username and password."
      })
    }
  });

  
router.get("/:userID", function(req,res){
  const mongoDB = req.app.locals.mongoDB;
  const userID = parseInt(req.params.userID);
  getUserByID(userID, mongoDB, false)
  .then((results) => {
    console.log("results: ", results)
    if(results){
      res.status(201).json({results: results});
    }else{
      //next();
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      error: "Unable to get user. Please try again later"
    });
  });
});


router.get('/:username/amiibo', function(req, res){
    const mongoDB = req.app.locals.mongoDB;
    const mysqlPool = req.app.locals.mysqlPool;
    const userID = req.params.username;
    getUserByUsername(userID, mongoDB, false)
    .then((results) => {
      console.log("User " + userID + " amiibo id's: " + results.amiibo);
      if(results.amiibo){ 
        getUserAmiiboByList(results.amiibo, mysqlPool)
        .then((amiibo) => {
          if(amiibo){
            res.status(201).json({amiibo: amiibo});
          }else{
            next();
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "Unable to fetch amiibo. Please try again later.",
          });
        });
      }  
    });
});

router.post('/:username/amiibo', function(req, res){
  const mongoDB = req.app.locals.mongoDB;
  const username = req.params.username;
  const amiiboID = req.body.amiiboID;
  updateUserAmiiboByUsername(username, amiiboID, mongoDB)
  .then((results) => {
    if(results){
      res.status(201).json({results: results});
    }else{
      console.log("Next");
      next();
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      error: "Unable to add amiibo. Please try again later",
      err: err
    });
  });
});

router.delete('/:username/amiibo/:amiiboid', function(req, res){
  const mongoDB = req.app.locals.mongoDB;
  const username = req.params.username;
  const amiiboID = parseInt(req.params.amiiboid);
  removeUserAmiiboByUsername(username, amiiboID, mongoDB)
  .then((results) => {
    if(results){
      res.status(201).json({results: results})
    }else{
      next();
    }
  })
  .catch((err) => {
    res.status(500).json({
      error: "Unable to remove amiibo. Please try again later"
    });
  });
});


exports.router = router;