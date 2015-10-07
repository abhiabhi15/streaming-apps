var twitter = require('ntwitter');
 
var t = new twitter({
     consumer_key : process.env.TWITTER_CONSUMER_KEY,
     consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
     access_token_key : process.env.TWITTER_ACCESS_TOKEN,
     access_token_secret : process.env.TWITTER_ACCESS_SECRET
});
 
// Words or hashtags for tracking tweets
var words = ['Election','Obama']; 
console.log("Tweets streaming for words : [" + words  + "] ");

 
  t.stream(
    'statuses/filter',
    { track: words },
    function(stream) {
        stream.on('data', function(tweet) {
				console.log(tweet.text);
        });
    });
