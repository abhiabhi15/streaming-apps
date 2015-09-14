var genderCache = [];
var fs = require('fs'),
readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('/home/abhishek/dstools/streaming-apps/mongoTwit/gender.txt'),
    output: process.stdout,
    terminal: false
});

rd.on('line', function(line) {
	var s = line.split("\t");
    console.log(s[0] + " ====  " + s[1]);
});


