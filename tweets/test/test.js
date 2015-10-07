var Twit = require('twit')

var T = new Twit({
	 consumer_key : process.env.TWITTER_CONSUMER_KEY,
     consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
     access_token : process.env.TWITTER_ACCESS_TOKEN,
     access_token_secret : process.env.TWITTER_ACCESS_SECRET
});

/*
T.post('statuses/update', { status: 'Using API to tweet, Hello World!' }, function(err, data, response) {
  console.log(data)
})
*/

/*
T.get('followers/ids', { screen_name: 'lovish0311' },  function (err, data, response) {
  console.log(data)
})
*/

/*
T.get('users/show', { user_id: '53307270' },  function (err, data, response) {
  console.log(data)
})
*/
/*
T.get('search/tweets', { q : 'geocode=40.785493,-73.969033,1000mi', count:100},  function (err, data, response) {
  console.log(data)
})
*/
/*
T.get('users/search', { q: 'geocode:35.767745,-78.675585,1mi' ,page:1 }, function(err, data, response) {
	
	console.log("Total Count = " + data.length);
	for(i =0; i < data.length; i++){
		var tweetJson = data[i];
		console.log("Screen Name =" + tweetJson.screen_name + ", followers = " + tweetJson.followers_count + ", location = " +  tweetJson.location 	 + ", friends = " + tweetJson.friends_count);
	}
})
*/

/*
getFollowersList("8942262", -1);

function getFollowersList(user_id, cnum){
	
	T.get('followers/list', {user_id: user_id, count:200, cursor: cnum},  function (err, data, response) {
		cnum = data.next_cursor;
		console.log(data);
		if(cnum > 0){
			 getFollowersList(user_id, cnum)
		}
	});
}
*/
var sname = 'davidjoepat';
T.get('followers/ids', { screen_name : sname },  function (err, data, response) {
  console.log(data)
  });
