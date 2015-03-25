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
var words = ['CWC2015','CWC15','INDVSAUS','AUSVSIND','cricket']; 
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
				twt.id_str = tweet.id_str;
				twt.created_at = tweet.created_at;
				twt.text = tweet.text;
				twt.retweet_count = tweet.retweet_count;
				twt.favorite_count = tweet.favorite_count;
				twt.favorited = tweet.favorited;
				twt.retweeted = tweet.retweeted;
				twt.timestamp_ms = tweet.timestamp_ms;
				if( tweet.user != null){
					twt.timezone = tweet.user.time_zone;
					twt.location = tweet.user.location;
				}
				if(tweet.geo != null){
					twt.geo = tweet.geo;
					twt.coordinates = tweet.coordinates;
					twt.place = tweet.place;
				}
	            collection.insert({'tweet': twt});
            });
        });
    }
  );
});
