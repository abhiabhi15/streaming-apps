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
var genreObj;
var genreCache;

var jsonFile = require('jsonfile');
var util = require('util');
var filename =  '/home/abhishek/dstools/streaming-apps/apis/genre.json';

db.open(function(err, db) {
      assert.equal(null, err);
      console.log("DB open");
	  genreObj = jsonFile.readFileSync(filename);
      genreCache = genreObj.genre;
      console.log("rGender Callback" + JSON.stringify(genreObj));

      var collection = db.collection('q1_2004');
      findDocuments(collection, function(){
      });
});

var genreCount = 0;
var findDocuments = function(collection, callback) {
  // Get the documents collection

  // Find some documents
  collection.find().toArray(function(err, docs) {
    assert.equal(err, null);
    for(var i=0;i < docs.length; i++){
        var reviews = docs[i].reviews;
        for(var j=0; j < reviews.length; j++){
            var newUrl = url + reviews[j].prod_id;
            getProductDetail(newUrl, reviews[j], function(){

            });
        }
    }
  });
}

var getProductDetail = function(url, reviewJson, callback){
	
	if(genreCache[reviewJson.prod_id] === undefined){
		request( url, function (error, response, html) {
	 	 	if (!error && response.statusCode == 200) {
	    		var $ = cheerio.load(html);
	    		var genreItems = $("#wayfinding-breadcrumbs_feature_div li:last-child").text().trim();
			    if(genreItems.length == 0){
    			     genreItems = $("[href ^='https://www.amazon.com/s/ref=atv_dp_imdb_hover_genre']").text();
	    		}
				if(genreItems.length > 0){
					genreCache[reviewJson.prod_id] = genreItems;
					console.log("Url = " + url + " , genre = " + genreItems); 
					genreCount++;

					if(genreCount % 10 == 0){
						console.log("Write file  " + JSON.stringify(genreObj));
	    	            jsonFile.writeFile(filename, genreObj, {spaces: 2}, function(err) { });
        	    	}
				}
		    }else{
			 	  console.log("Error in URL "  + url);	
	  		}
		});	
  	}

}

