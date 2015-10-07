var Twit = require('twit')

var T = new Twit({
	 consumer_key : process.env.TWITTER_CONSUMER_KEY,
     consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
     access_token : process.env.TWITTER_ACCESS_TOKEN,
     access_token_secret : process.env.TWITTER_ACCESS_SECRET
});


var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    assert = require('assert')
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('graph', server);


/*	
var userIds= [];
db.open(function(err, db) {
	assert.equal(null, err);
	db.collection('users', function(err, collection) {
		var cursor = collection.find();
		cursor.each(function(err, doc) {
			console.log(doc.user_id);
			if(doc.user_id != undefined){
				getFollowersList(doc.user_id, -1, function(){
				
				});
			}
		});
 	});
});


getFollowersList = function(user_id, cnum){
	
	T.get('followers/ids', {user_id: user_id, count:5000, cursor: cnum},  function (err, data, response) {
		cnum = data.next_cursor;
		console.log(data);
		if(cnum > 0){
			 getFollowersList(user_id, cnum)
		}
	});
}
*/

db.open(function(err, db) {
      assert.equal(null, err);
      getConnections(db, "friends", function(){
        db.close();
      });
});


var getConnections = function(db, type, callback) {
	if(type == "friends" || type == "followers"){
		console.log("Finding Connection = " + type)
	
  		var userCol = db.collection('users');
		var typeCol = db.collection(type);

	 	userCol.find().toArray(function(err, docs) {
    		assert.equal(err, null);
			var total = docs.length;
			var limit = 15;
			var counter = 0;
		    while(counter <= total){
				for(var i=counter; i < counter+limit; i++){
					var connJson = {};
		        	var user_id = docs[i].user_id;
					connJson.host = user_id;
		 
			        getTypeConnections(connJson, type, function (connObj){
						typeCol.insert(connObj);
        		    });
    			}
				counter += counter + limit;
				if((counter + limit) > total){
					limit  = total - counter;
				}
			}
		});
	}
}



var getTypeConnections = function(connJson, type, callback){

    console.log("Finding " + type + "  for  = " + connJson.host);
	var host = connJson.host;
	switch(type){
		case 'friends' :
							T.get('friends/ids', { user_id: host, stringify_ids: true },  function (err, data, response) {
								connJson.friends = data.ids;	
        		    			console.log("UserId  = " + host + " , total friends = " + connJson.friends.length);
								callback(connJson);
							});
							break;
		case 'followers' :
							T.get('followers/ids', { user_id: host, stringify_ids: true },  function (err, data, response) {
								connJson.followers = data.ids;	
        		    			console.log("UserId  = " + host + " , total followers = " + connJson.followers.length);
								callback(connJson);
							});
							break;
	}
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}
