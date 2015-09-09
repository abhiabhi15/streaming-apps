var twitter = require('ntwitter');
var mongo = require('mongodb');
var unirest = require('unirest');

var t = new twitter({
     consumer_key : process.env.TWITTER_CONSUMER_KEY,
     consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
     access_token_key : process.env.TWITTER_ACCESS_TOKEN,
     access_token_secret : process.env.TWITTER_ACCESS_SECRET
});
 
var Server = mongo.Server,
    Db = mongo.Db,
    assert = require('assert')
    BSON = mongo.BSONPure;

// Words or hashtags for tracking tweets
var words = ['DataScience','BigData','DataScientist','Analytics','Python','MachineLearning','Statistics','rstats','DataMining','DataAnalytics','DataAnalysis','PredictiveAnalytics','SmartCity','IOT','hadoop','dataviz','DeepLearning','BusinessIntelligence']; 

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('graph', server);

db.open(function(err, db) {
	  assert.equal(null, err);
	  findDocuments(db, function(){
	  	db.close();
	  });
});

var getTweets = function(db, callback){
	console.log("Tweets streaming for words : [" + words  + "] ");
	db.open(function(err, db) {
	  assert.equal(null, err);
	  t.stream(
    	'statuses/filter',
	    { track: words },
    	function(stream) {
        	stream.on('data', function(tweet) {
            	db.collection('tracker', function(err, collection) {
					console.log(tweet.text + " ---- User = " + tweet.user.name);
		            collection.insert(tweet);
    	        });
        	});
    	}
  	  );
	callback();
	});
}

var findDocuments = function(db, callback) {
	console.log("Finding all tweets with lang=en")
  // Get the documents collection
  var collection = db.collection('tracker');
  var userColl = db.collection('users');
  userColl.createIndex({"user_id" : 1}, {unique : true, dropDups : true});
  
  // Find some documents
  collection.find({lang:'en'}).toArray(function(err, docs) {
  assert.equal(err, null);
	
	for(var i=0;i < docs.length;i++){
		var user = docs[i].user;
		var userJson = {};
		userJson.user_id = user.id_str;
		userJson.name = user.name;
		userJson.screen_name = user.screen_name;
		userJson.location = user.location;
		userJson.description = user.description;
		userJson.followers_count = user.followers_count;
		userJson.friends_count = user.friends_count;
		userJson.status = docs[i].text;
		userJson.statuses_count = user.statuses_count;
		userJson.favourites_count = user.favourites_count;

		getGender(userJson, function (userObj){
			console.log("Username  = " + userObj.name + " , gender = " + userObj.gender);
			userColl.insert(userObj);	
		});
	}
   });
}

var getGender = function(user, callback){
	
	uname = user.name.split(" ")[0];
	console.log("Username in Get gender = " + uname);

	unirest.get("https://montanaflynn-gender-guesser.p.mashape.com/?name="+uname)
	.header("X-Mashape-Key", "W5ab33nH2pmshiZDb0PdLhl8EImWp1GlThgjsnVyOZwfsMW40R")
	.header("Accept", "application/json")
	.end(function (result) {
		user.gender = result.body.gender;
		callback(user);
	 });
}
