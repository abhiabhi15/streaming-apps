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

db.newTwit.find({"tweet.geo" : {$exists:true}}).count()

#17,298


db.mytweets.aggregate([{ $sort : { 'tweet.ts' : 1} }]).forEach(function(doc) {
    db.cwctweets.insert(doc);
});

