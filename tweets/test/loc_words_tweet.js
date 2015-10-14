var Twit = require('twit')

var T = new Twit({
     consumer_key : process.env.TWITTER_CONSUMER_KEY,
     consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
     access_token : process.env.TWITTER_ACCESS_TOKEN,
     access_token_secret : process.env.TWITTER_ACCESS_SECRET
});
 
// Words or hashtags for tracking tweets
var words = ['Election','Obama','love','hate','sun', 'wolfpack']; 
console.log("Tweets streaming for words : [" + words  + "] ");

var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]
var raleigh = ['-79.14','35.63','-78.34','36.02'];
//var stream = T.stream('statuses/filter', {locations: raleigh, track:words });
var stream = T.stream('statuses/filter', {locations: raleigh});

stream.on('tweet', function (tweet) {
	console.log(tweet.text + " ===  " + tweet.user.location)
}) 
