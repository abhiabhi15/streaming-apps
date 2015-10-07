db.cwctweets.createIndex({"tweet.id" : 1}, {unique : true, dropDups : true})
db.cwctweets.createIndex({ "tweet.ts": 1});

db.newTwit.find().forEach(function(doc) {
    db.newTwit.insert(doc);
});

db.twit1.aggregate(
   [
     { $sort : { 'tweet.ts' : 1} }
   ]
)

db.newTwit.find({"tweet.tz" : {$exists:true}}).count()

#17,298

#401627


db.mytweets.aggregate([{ $sort : { 'tweet.ts' : 1} }]).forEach(function(doc) {
    db.cwctweets.insert(doc);
});


db.cwctweets.find().forEach( function(obj) {
    obj.my_value= parseInt(obj.tweet.ts);
    db.my_collection.save(obj);

});

db.cwctweets.find({ "tweet.ts" : { $gt :  1427329782738, $lt : 1427329787738}}).count();

db.runCommand ( { count: "cwctweets", key: "tweet.sentiment" } )
