/* initialization script for Mongodb */

const mongoDBName = process.eng.MONGO_DATABASE;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;

const username = mongoUser;
const pass = mongoPassword;
db.createUser({
  user: username,
  pwd: pass,
  roles: [
    {
      role: "readWrite",
      db: mongoDBName
    }
  ]
});
