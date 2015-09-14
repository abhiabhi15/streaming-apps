var unirest = require('unirest');


unirest.get("https://montanaflynn-gender-guesser.p.mashape.com/?name=Anand")
.header("X-Mashape-Key", "W5ab33nH2pmshiZDb0PdLhl8EImWp1GlThgjsnVyOZwfsMW40R")
.header("Accept", "application/json")
.end(function (result) {
	console.log("Time Check");
	setTimeout(function(){console.log(result.body)},5000);
 });



