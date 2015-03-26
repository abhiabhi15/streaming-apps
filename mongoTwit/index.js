var twitter = require('ntwitter');
var mongo = require('mongodb');
 
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
var words = ['CWC2015','CWC15','INDVSAUS','AUSVSIND','WorldCup2015','IND VS AUS', 'AUS VS IND', 'Worldcup', 'ICCWorldCup2015']; 
console.log("Tweets streaming for words : [" + words  + "] ");

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('twitterstream', server);
db.open(function(err, db) {
  assert.equal(null, err);
 
  t.stream(
    'statuses/filter',
    { track: words },
    function(stream) {
        stream.on('data', function(tweet) {
            db.collection('cwcTweets', function(err, collection) {
//				console.log(tweet);
				var twt = {};
				twt.id = tweet.id;
				twt.created_at = tweet.created_at;
				twt.txt = tweet.text;
				twt.rc = tweet.retweet_count;
				twt.fc = tweet.favorite_count;
				twt.ts = tweet.timestamp_ms;
				if( tweet.user != null){
					if(tweet.user.time_zone != null){
						twt.tz = tweet.user.time_zone;
					}
					if(tweet.user.location != null && tweet.user.location.length > 0){
						twt.loc = tweet.user.location;
					}
				}
				if(tweet.geo != null){
					twt.geo = tweet.geo;
					if(tweet.place != null){
						twt.p_type = tweet.place.place_type;	
						twt.p_name = tweet.place.full_name;
						twt.c_code = 	tweet.place.country_code;
						twt.country = 	tweet.place.country;															
					}
				}
	            collection.insert({'tweet': twt});
            });
        });
    }
  );
});
