var mongo = require('mongodb');
var unirest = require('unirest');

var Server = mongo.Server,
    Db = mongo.Db,
    assert = require('assert')
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('dblp', server);

var genderObj;
var genderCache;

var jsonFile = require('jsonfile');
var util = require('util');
var filename =  '/home/abhishek/dstools/streaming-apps/api/gender.json';

db.open(function(err, db) {
	  assert.equal(null, err);
	  console.log("DB open");
	  genderObj = jsonFile.readFileSync(filename);
	  genderCache = genderObj.gender;
	  console.log("rGender Callback" + JSON.stringify(genderObj));
	  findDocuments(db, function(){
	  });
});

var genderCount = 0;

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('a_2001');
  
  // Find some documents
  collection.find().toArray(function(err, docs) {
  assert.equal(err, null);
	
	for(var i=0;i < docs.length;i++){

		getGender(docs[i], function (userObj){
	//		console.log("Username  = " + userObj.name + " , gender = " + userObj.gender);
			collection.update({uid:userObj.uid}, {$set: {gender:userObj.gender}});
			genderCount++;
			if(genderCount == docs.length){
				console.log("Write file  " + JSON.stringify(genderObj));
				jsonFile.writeFile(filename, genderObj, {spaces: 2}, function(err) { });
			}
		});
	}
  });
}

var getGender = function(author, callback){
	
	var uname = author.name.split(" ")[0];
	console.log("Username in Get gender = " +uname + " == " +  genderCache[uname]);
	if(genderCache[uname] != undefined){
		author.gender = genderCache[uname];
		callback(author);
	}else{

		unirest.get("https://montanaflynn-gender-guesser.p.mashape.com/?name="+uname)
		.header("X-Mashape-Key", "W5ab33nH2pmshiZDb0PdLhl8EImWp1GlThgjsnVyOZwfsMW40R")
		.header("Accept", "application/json")
		.end(function (result) {
			if(result.body.gender === undefined){
				genderCache[uname] = "notfound";
			}else{
				genderCache[uname] = result.body.gender;
			}

			console.log("API Returned ===== " + uname + " , gender = " + genderCache[uname]);
			author.gender =  genderCache[uname];
			callback(author);
	 	});
	}
}
