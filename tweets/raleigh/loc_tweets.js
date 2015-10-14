var Twit = require('twit')
var mongo = require('mongodb');

var T = new Twit({
     consumer_key : process.env.TWITTER_CONSUMER_KEY,
     consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
     access_token : process.env.TWITTER_ACCESS_TOKEN,
     access_token_secret : process.env.TWITTER_ACCESS_SECRET
});

var Server = mongo.Server,
    Db = mongo.Db,
    assert = require('assert')
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('tweets', server);

var raleigh = ['-79.14','35.63','-78.34','36.02'];
var stream = T.stream('statuses/filter', {locations: raleigh});

db.open(function(err, db) {
  assert.equal(null, err);
 
	stream.on('tweet', function (tweet) {
        db.collection('raleigh', function(err, collection) {
			var twt = {};
			twt.id = tweet.id;
			twt.created_at = tweet.created_at;
			twt.txt = tweet.text;
			twt.rc = tweet.retweet_count;
			twt.fc = tweet.favorite_count;
			twt.ts = tweet.timestamp_ms;
			if( tweet.user != null){
				
				twt.user_id = tweet.user.id_str;
				twt.name =  tweet.user.name;
				twt.screen_name =  tweet.user.screen_name;
				twt.description =  tweet.user.description;
				twt.followers_count =  tweet.user.followers_count;
				twt.friends_count =  tweet.user.friends_count;
				twt.fav_count =  tweet.user.favourites_count;
				twt.status_count =  tweet.user.statuses_count;
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
	            collection.insert(twt);
            });
        });
    }
  );
