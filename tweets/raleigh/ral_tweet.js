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
db = new Db('graph', server);
var total_followers=0;
var total_friends=0;
var userIds = [];
// Query for NC State Raleigh, Centennial Campus
db.open(function(err, db) {
  assert.equal(null, err);

	for(var i = 1; i <= 50; i++) {

		T.get('users/search', { q: 'geocode:35.7721000,-78.6386100,30mi' ,page:i }, function(err, data, response) {
//			console.log("Total Count = " + data.length);
			for(i =0; i < data.length; i++){
				var tweetJson = data[i];
				userIds.push(tweetJson.id_str);
				console.log("Screen Name =" + tweetJson.screen_name + ", followers = " + tweetJson.followers_count + ", location = " +  	tweetJson.location 	 + ", friends = " + tweetJson.friends_count + ", ratio = " + tweetJson.friends_count/tweetJson.followers_count);
				total_friends += tweetJson.friends_count;
				total_followers += tweetJson.followers_count;
  //      	    db.collection('random', function(err, collection) {
	//        	    collection.insert(tweetJson);
      //      	});
		}
		
				console.log("friends = " + total_friends + ", followers = " + total_followers);
		});
	}

});

function getFollowersList(user_id, cnum, db){
	
    T.get('followers/list', {user_id: user_id, count:200, cursor: cnum},  function (err, data, response) {
    	var followerJson = {};
		followerJson.userId = user_id;
		followerJson.followers = data.users;
		
		db.collection('followers', function(err, collection) {
        	collection.insert(followerJson);
	    });

	    cnum = data.next_cursor;
        console.log("user_id " + user_id + "cnum = " + cnum);
        if(cnum > 0){
             getFollowersList(user_id, cnum, db)
        }
    });
}

