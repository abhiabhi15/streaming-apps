//var timezonedb = require("timezonedb-node")("5525QNGWUIKJ");
var timezoner = require('timezoner');

var inputFile='/home/abhishek/dstools/streaming-apps/apis/mooc.json';
var jsonFile = require('jsonfile');
var moocObj = jsonFile.readFileSync(inputFile);
var tzObj = moocObj.timezone;

var tzCount = 0;


var getTimeZone = function(userKey, callback){
	timezoner.getTimeZone(
    	tzObj[userKey].lat.trim(),
	    tzObj[userKey].lon.trim()
		, function(error, data) {
    		if(!error) {
        		console.log(userKey + " === " + JSON.stringify(data) 					+ " =====  " + data.gmtOffset);
		   	} else {
	    	    console.error(error);
    		}
		});
}



for(userKey in tzObj){
		console.log(userKey);
		getTimeZone(userKey, function(obj){
			tzCount++;
			if(tzCount == tzObj.length){
				jsonFile.writeFile(inputFile, moocObj, {spaces:2}, function(err) { });
			}
		});
}

