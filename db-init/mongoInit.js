/* initialization script for Mongodb */

/* could not get environment variables working with this
* so hard coded stuff it is for now */
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
