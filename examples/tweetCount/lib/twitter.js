
var twitter = require('ntwitter');
var word0Count=0;
var word1Count=0;
var words = [];
var twitJson = "";
var oldTwit = "";

var MyTwitter = function(words){
	this.words = words;
}

MyTwitter.prototype.startStreaming = function(){

	var twit = new twitter({
		consumer_key : process.env.TWITTER_CONSUMER_KEY,
		consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
		access_token_key : process.env.TWITTER_ACCESS_TOKEN,
		access_token_secret : process.env.TWITTER_ACCESS_SECRET
	});
  	var words = this.words;
	twit.stream(
    	'statuses/filter',
	    {track : words},
		function(stream){
			stream.on('data', function(tweet){
				twitJson = twitProcessor(tweet,words);
				//console.log(twitJson);
			});

			stream.on('error', function(error, code) {
				console.log("Error Occurred: " + error + ": " + code);
			});

	        stream.on('end', function(response){
			    console.log('Connection ended');
			});
		
			stream.on('destroy', function(response){
			    console.log('Connection Destroyed');
			});
		}
	);
}

function twitProcessor(tweet, words){
	var tweetJson = {};
	if(tweet.text.toLowerCase().indexOf(words[0]) != -1){
		tweetJson.key = words[0];
		word0Count++;
	}else if(tweet.text.toLowerCase().indexOf(words[1]) != -1){
		tweetJson.key = words[1];
		word1Count++;
	}

	tweetJson.text = tweet.text;
	tweetJson.user = tweet.user.screen_name;
	tweetJson.pic = tweet.user.profile_image_url;
	return tweetJson;
}

MyTwitter.prototype.getTweetJson = function(){
	 var tweetJson = {};
	 tweetJson.summary = summary(this.words);
	 if(oldTwit != twitJson){
	 	tweetJson.tweet = twitJson;
		oldTwit = twitJson;
	 }
	 //console.log(tweetJson);
	 return tweetJson;
}

function summary(words){
	var summary ={};
	summary.total = word0Count + word1Count;

	var wordArray = [];
	var word0 = {};
	word0.word = words[0];
	word0.count = word0Count;
	word0.percent = Math.round((word0Count/summary.total)*100);
	wordArray[0] = word0;
	var word1 = {};
	word1.word = words[1];
	word1.count = word1Count;
	word1.percent = Math.round((word1Count/summary.total)*100);
	wordArray[1] = word1;
	summary.words = wordArray;
	return summary;
}

module.exports = MyTwitter;
