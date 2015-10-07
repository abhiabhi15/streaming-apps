
var mysql = require('mysql');
var user = "";
var connection = "";

var Mysql = function(user){
	this.user = user;
}

// Opening mysql connection
Mysql.prototype.openConnection = function(){
	this.connection =  mysql.createConnection({
					   host : '127.0.0.1',
					   user : this.user,
				       password : process.env.MYSQL_PASSWORD
	});

	this.connection.connect(function(err) {
		if (err) {
	    	console.error('error connecting: ' + err.stack);
		  	return;
	    }
		console.log('[INFO] connection established successfully!!');
    });
}

// Creating tables for storing Pivotal Tracker Data
Mysql.prototype.createTables = function(){
	var conn = this.connection;
	conn.query('CREATE DATABASE applico', function(err, results) {
			if(err != null) {
					console.log("[ERROR] Database applico Already Exists ");
		    }else{
				console.log("[INFO] database created successfully");
			}
			createTables(conn);
	});
}

// Helper Function to createTables as callback
function createTables(conn){
	
	query(conn, 'USE applico;');
	var storyTable='CREATE TABLE Story ( story_id INT(10) PRIMARY KEY, '+
							             'story_name varchar(15), ' +
										 ' story_type varchar (10), ' +
								  	     ' estimate INT(5) default 0 );';
			
	var trackerTable = 'CREATE TABLE Tracker ( story_id INT(10) PRIMARY KEY, ' +
										       'request_by_id INT(10), ' + 
											    'owner_id INT(10) );';				  

	var userTable = 'CREATE TABLE User( user_id INT(10) PRIMARY KEY, user_name VARCHAR (5) );';
	var user1Insert = 'INSERT INTO User (user_id,user_name) VALUES ("1462570","XZ");';
	var user2Insert = 'INSERT INTO User (user_id,user_name) VALUES ("1420764","PA");';

	query(conn, storyTable);	
	query(conn, trackerTable);	
	query(conn, userTable);
	query(conn, user1Insert);
	query(conn, user2Insert);
	commit(conn);
}

/*
======================================================================================
 Funtions to store pivotal data and Query the DB for the desired results in callbacks
======================================================================================
*/

//Storing data of pivotal tracker : Upsert operations
Mysql.prototype.upsertStories = function (stories){

	var conn = this.connection;
    var st_queryStr= "";
    var tr_queryStr= "";
    for(var i=0; i < stories.length; i++){
        var story = stories[i];
        if(story.estimate == null){
            story.estimate = 0;
        }

        st_queryStr = 'Insert into Story (story_id, story_name, story_type, estimate) VALUES ';
        st_queryStr += '( "' + story.id + '","' + story.name + '","' + story.storyType + '", "' + story.estimate + '") ';
        st_queryStr += 'on duplicate key update story_name = values(story_name), story_type = values(story_type), estimate = values(estimate);';

        tr_queryStr = 'Insert into Tracker (story_id, request_by_id, owner_id) VALUES ';
        tr_queryStr += '("' + story.id + '","' + story.requestedById + '","' + story.ownedById + '") ';
        tr_queryStr += 'on duplicate key update request_by_id = values(request_by_id), owner_id = values(owner_id)';

        query(conn, st_queryStr);
        query(conn, tr_queryStr);
    }
    commit(conn, executeMyQuery);
}

// Executing Desired Query 
function executeMyQuery(conn){
	var queryStr = "select SUM(estimate) as ESTIMATES from Story where story_id in ( "+
                         " select story_id from Tracker where request_by_id in ( " +
                              " select request_by_id from Tracker where story_id in ( " +
                                    "select story_id from Story where story_type='bug' "+
                          ")  group by request_by_id  having count(*) > 2 " +
					"))"+
					" union ALL " +	
					"select SUM(estimate) from Story where story_id in ( "+
  					    " select story_id from Tracker where owner_id in ( " +
							" select request_by_id from Tracker where story_id in ( " +
							      " select story_id from Story where story_type='bug' " +
    				" ) group by request_by_id    having count(*) > 2 " +
			  "));";


	conn.query(queryStr, function(err, results){
		console.log("========= Query Output [Requested Estimates, Owned Estimates ] =======\n");
		console.log(results);
		console.log("\n");
		end(conn);
	});
}

/*
===============================================
General Helper Functions for DB Activities
===============================================
*/


// function to execute any query
function query(conn, queryStr){
	
	conn.query(queryStr, function(err, results){
		if (err != null) {
			console.log("[ERROR]: " + err.message);
		 }else{
		 	console.log('[INFO] query executed successfully');
		 }
	});
}

//function to commit any changes
function commit(conn,callback){
	conn.commit(function(err) {
	     if (err) { 
		      connection.rollback(function() {
			      throw err;
			  });
		 }
		 console.log('[INFO] Commit success!');
		 if(callback != null){
		 	callback(conn);
		 }
	});
}

//function to end the connection
function end(conn){
	conn.end(function(err){
		if(err != null){
			console.log("[ERROR] :" +  error);
			throw err;
		}
		console.log("[INFO] Connection terminated successfully");
	});
}

module.exports = Mysql;
