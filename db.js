var db_uri = '127.0.0.1:27017/sosmentor';
var collections = ['users'];

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  db_uri = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_APP_NAME;
}

var db = require('mongojs')(db_uri, collections);

module.exports = db;
