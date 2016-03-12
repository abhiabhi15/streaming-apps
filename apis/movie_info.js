var mongo = require('mongodb');
var omdb = require('omdb');

var Server = mongo.Server,
    Db = mongo.Db,
    assert = require('assert')
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('movie', server);

var util = require('util');

db.open(function(err, db) {
      assert.equal(null, err);
      console.log("DB open");
      var collection = db.collection('m_data');
      findDocuments(collection, function(){
      });
});

var findDocuments = function(collection, callback) {
  // Get the documents collection

  // Find some documents
  collection.find().toArray(function(err, docs) {
    assert.equal(err, null);
    for(var i=0;i < docs.length; i++){
        var obj = docs[i];
        getProductDetail( obj, function(movieObj){
//			console.log(movieObj);
	       collection.update({prod_id:movieObj.prod_id}, {$set: { details:movieObj.details }});
		});
    }
  });
}

var counter = 0;
var getProductDetail = function(obj, callback){

	omdb.get({ title: obj.title }, true, function(err, movie) {
    	if(err) {
        	return console.error(err);
    	}

		if(!movie) {
			return console.log('Movie not found!');
		}
		counter++;
		console.log("Counter = " + counter  + " title = " + obj.title );
//		console.log(movie);
		obj.details = movie;
		callback(obj);

	});
}
