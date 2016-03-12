var request = require('request');
var cheerio = require('cheerio');
var mongo = require('mongodb');


var Server = mongo.Server,
    Db = mongo.Db,
    assert = require('assert')
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('movie', server);

var url = 'http://www.amazon.com/gp/product/';
var util = require('util');

db.open(function(err, db) {
      assert.equal(null, err);
      console.log("DB open");
      var collection = db.collection('m_info');
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
        var newUrl = url + obj.prod_id;
        getProductDetail(newUrl, obj, function(movieObj){
	       //collection.update({prod_id:movieObj.prod_id}, {$set: { title:movieObj.title }});
		});
    }
  });
}

var getProductDetail = function(url, obj, callback){

	request( url, function (error, response, html) {
	 	if (!error && response.statusCode == 200) {
			//  		   console.log(html);
	 		var $ = cheerio.load(html);

	   		var title = $("#productTitle").text().trim();
			if(title.length == 0){
				title = $("#aiv-content-title").clone().children().remove().end().text().trim();
			}
			if(title.length > 0){
				console.log("ProductId = " + obj.prod_id + " , title = " +title );
			}
		}else{
		 	console.log("Error in URL "  + url);	
	  	}
		callback(obj);
	});	
}
