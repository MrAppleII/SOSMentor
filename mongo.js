var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;

module.exports = {
  connect: function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
<<<<<<< HEAD
      
      db = _db;
      connected = true;
      
=======

      db = _db;
      connected = true;

>>>>>>> 950a5137640f77b2a535fb85319ba07f1125159f
      callback(db);
    });
  },
  collection: function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    }
<<<<<<< HEAD
    
=======

>>>>>>> 950a5137640f77b2a535fb85319ba07f1125159f
    return db.collection(name);
  }
};
