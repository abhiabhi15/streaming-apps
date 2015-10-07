var jsdom = require("jsdom");
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    assert = require('assert')
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('movie', server);

var url  = 'http://www.amazon.com/gp/pdp/profile/'; 

db.open(function(err, db) {
      assert.equal(null, err);
  //    console.log("DB open");
      findDocuments(db, function(){
	  		
      });
});

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('q1_2004');
  
  // Find some documents
  collection.find().toArray(function(err, docs) {
  assert.equal(err, null);
    for(var i=0;i < docs.length; i++){
		var newUrl = url + docs[i].userId;
        getUserProfile(newUrl, docs[i], function (userObj){
//			console.log(JSON.stringify(userObj));
            collection.update({userId:userObj.userId}, {$set: { rank :userObj.rank, hscore : userObj.hscore, loc : userObj.loc, interest : userObj.interest }});
        });
    }
  });
}

var counter = 0;

var getUserProfile = function(url, userJson, callback){
	//console.log(url);
	jsdom.env({
	  url: url,
	  scripts: ["http://code.jquery.com/jquery.js"],
	  loaded: function (err, window) {
		if(err){
			console.log( userJson.userId + " | ERROR = " + err);
			return;
		}
		// Location Selection
		var p_loc = window.$("div.profile-name-container").siblings("span").text().trim();
		if(p_loc.length > 0){
			userJson.loc = p_loc;
		}

		// Ranking Selection
		var p_rank = window.$("a.top-reviewer-link span.a-size-large").text().trim();
		if(p_rank.length > 0){
			userJson.rank = numberFormat(p_rank);
		}else{
			var lrank = window.$("div.profile-info div.a-spacing-small span.a-size-small").text().trim();
			lrank = lrank.split("\n");
			for(var i=0; i < lrank.length; i++){
				if(lrank[i].indexOf("Reviewer") !=-1){
					var rankStr = lrank[i].split(":")[1].trim();
					userJson.rank = numberFormat(rankStr);
					break;
				}
			}
		}

		// Helpfulness Selection
		var p_hscore = window.$("div.customer-helpfulness span.a-size-large").text().trim();
		if(p_hscore.length > 0){
			hscore = p_hscore.substring(0, p_hscore.length-1);
			userJson.hscore = parseInt(hscore)/100;
		}

		// Interestes Selection
		var p_intrst = window.$("div.profile-interests span.a-size-small").text().trim();
		if(p_intrst.length > 0){
			userJson.interest = p_intrst;
		}
		console.log("[ " + userJson.userId + ", loc : " + userJson.loc + " , rank:" + userJson.rank + ", hscore: " + userJson.hscore + ", reviews = " + userJson.reviews.length  + ", interests = " + userJson.interest );

		counter++;
		console.error("Counter Records = " + counter);
		callback(userJson);
  	  }
	});


}

function numberFormat(num){

	var num = num.substring(1, num.length);
	return num.replace(/[^0-9\.]+/g,"");
}
