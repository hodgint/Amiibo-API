const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const mongoClient = require('mongodb').MongoClient;
const api = require('./api');

const app = express();
const port = process.env.PORT || 8000;

/* My sql connection */
const mysqlHost = process.env.MYSQL_HOST;
const mysqlPort = process.env.MYSQL_PORT || '3306';
const mysqlDBName = process.env.MYSQL_DATABASE;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;


/* Mongo connection information */
const mongoHost = process.env.MONGO_HOST;
const mongoDBName = process.env.MONGO_DATABASE;
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoUser = process.env.MONGO_INITDB_USERNAME; // issues grabbing these from .env
const mongoPassword = process.env.MONGO_INITDB_PASSWORD;
const mongoRootName = 'mongoROOT';//process.env.MONGO_ROOT_USERNAME;
const mongoRootPass = 'password1'; //process.env.MONGO_ROOT_PASSWORD; 
const mongoURL = `mongodb://${mongoRootName}:${mongoRootPass}@${mongoHost}:${mongoPort}/${mongoDBName}?authSource=admin`
console.log("== Mongo URL:", mongoURL);

const maxMySQLConnections = 10;
app.locals.mysqlPool = mysql.createPool({
  connectionLimit: maxMySQLConnections,
  host: mysqlHost,
  port: mysqlPort,
  database: mysqlDBName,
  user: mysqlUser,
  password: mysqlPassword
});

app.use(bodyParser.json());
//app.use(express.static('public'));

app.use('/', api);


app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});


function mongoConnect(){
  mongoClient.connect(mongoURL, { useNewUrlParser: true}, function(err, client){
    console.log("== in mongo connect");
    if(!err){

      app.locals.mongoDB = client.db(mongoDBName);
      app.listen(port, function() {
        console.log("== Server is running on port", port);
      });
    }else{
      console.log("error: ", err);
    }
  });
}
setTimeout(mongoConnect, 10000);