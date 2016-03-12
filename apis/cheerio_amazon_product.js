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
var genreMap;
var genreDict;

var jsonFile = require('jsonfile');
var util = require('util');
var cacheFile =  '/home/abhishek/dstools/streaming-apps/apis/genre_cache.json';
var dictFile =  '/home/abhishek/dstools/streaming-apps/apis/genre_dict.json';

db.open(function(err, db) {
      assert.equal(null, err);
      console.log("DB open");
	  genreObj = jsonFile.readFileSync(cacheFile);
      genreCache = genreObj.genre;
	  genreDict  = 	jsonFile.readFileSync(dictFile).dict;
      
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
				//Search-1 : Finding in Breadcrumbs
	    		var genreItems = $("#wayfinding-breadcrumbs_feature_div li:last-child").text().trim();
				
			    if(genreItems.length == 0){
					 //Search-2 Finding in New UI Items
    			     genreItems = $("[href ^='https://www.amazon.com/s/ref=atv_dp_imdb_hover_genre']").map(function(){
					                return $(this).text(); }).get();
					 if(genreItems.length > 0){
					 	 genreItems = getFromGenreDict(genreItems);	
				 	 }
	    		}else{
					genreItems = getGenre(genreItems, reviewJson.prod_id);
					if ( genreItems == "unknown"){

						//Search-3 Find in Amazon Best Seller Rank Items
						console.log("Finding in Best Sellers");
						parseItems = $("[href ^='http://www.amazon.com/gp/bestsellers/movies-tv/']").map(function(){
                	                    return $(this).text(); }).get();
						gitems = [];
						if(parseItems.length > 0){
								for (var i =0 ;i < parseItems.length; i++){
									itm = genreDict[parseItems[i]]; 
									if( itm === undefined){
										console.log(parseItems[i] + " is undefined");
									}else{
										gitems.push(parseItems[i]);
									}
								}
								genreItems = getFromGenreDict(gitems);
						}else{
							console.log("Cannot find anything in best seller, prodId = " + reviewJson.prod_id);
						}			
					}
				}
				
				console.log("Prod-id = " + reviewJson.prod_id + " , Genre = " + genreItems);
				if(genreItems.length == 0){
					console.log("Blocked By Amazon , Prod-Id = " + reviewJson.prod_id);
				}else{
					genreCache[reviewJson.prod_id] = genreItems;
					genreCount++;
				}
				if(genreCount % 100 == 0){
	    	           jsonFile.writeFile(cacheFile, genreObj, {spaces: 2}, function(err) { });
        	    }
		    }else{
			 	  console.log("Error in URL "  + url);	
	  			  console.log(error);
			}
		});	
  	}else{
		console.log("Found in Cache for " + reviewJson.prod_id + " , genre = " + genreCache[reviewJson.prod_id]);
	}

}

var unknown = ["unknown"];
function getGenre(genre, prodId){

	if(genreDict[genre] == undefined){
		console.log("Match Not Found For " + genre + ", prodId = " + prodId);
		return unknown;
	}else{
		return genreDict[genre];
	}
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function getKeyTerm(terms){
	var term = "";
	for(var i=0; i < terms.length; i++){
		term += terms[i].capitalizeFirstLetter();
	}
	return term;
}


function normalize(terms){
	for(var i=0; i < terms.length; i++){
		switch(terms[i]){
			case "Science Fiction":  terms[i] = "sci-fi"; break;
			case "Military & War":  terms[i] = "war"; break;
			case "Kids & Family":  terms[i] = "kids"; break;
			case "Musical":  terms[i] = "music"; break;
			case "Western":  terms[i] = "international"; break;
			case "All Disney Titles" :  terms[i] = "kids"; break;
			case "Mystery & Thrillers" :  terms[i] = "thriller"; break;
			case "Action & Adventure" :  terms[i] = "action"; break;
			case "Westerns" :  terms[i] = "international"; break;
			case "Foreign Films" :  terms[i] = "international"; break;
		}
		terms[i] = terms[i].toLowerCase();
	}
	return terms;
}

function getFromGenreDict(genreItems){
	var keyTerm = getKeyTerm(genreItems);
	if(genreDict[keyTerm] === undefined){
			genreItems = normalize(genreItems);
			genreDict[keyTerm] = genreItems;
			console.log("Adding Term = " + keyTerm + " , value = " + genreItems); 
	    	jsonFile.writeFile(dictFile, genreMap, {spaces: 2}, function(err) { });
	}else{
			genreItems = genreDict[keyTerm]; 
	}
	return genreItems;
}
