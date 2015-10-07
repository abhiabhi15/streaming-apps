
var myToken="0a1021e3dce4529136474517da486062"
var projectId=1151258

var tracker = require('pivotaltracker');
var client = new tracker.Client(myToken);

//MySQL Connection

var Mysql = require('./lib/mysql');
var mysql = new Mysql('root');
mysql.openConnection();

mysql.createTables(); // Creating all the Tables

getAllStories(projectId); // Fetching all the stories for the given projectId and then processing those in callbacks


/*
=================================================================
Helper Functions 
=================================================================
*/

function getAllStories(projectId){
	client.project(projectId).stories.all(function(error, stories) {
		if(error != null){
			console.log(error);
			process.exit();
		}
		mysql.upsertStories(stories);
	});
}

