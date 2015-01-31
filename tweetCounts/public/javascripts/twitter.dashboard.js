var server_name = "http://127.0.0.1:3000/";
var socket = io.connect(server_name);

socket.on('ss-words', function(data) {
	displayWords(data[0], data[1]);
});

function displayWords(word0, word1){
	$('.word0').html(word0 + '  ');
	$('.word1').html(word1 + ' ');
	$('.w0tweets').html(word0 + ' Word Tweets');
	$('.w1tweets').html(word1 + ' Word Tweets');
	$('#w0tweets').html('');
	$('#w1tweets').html('');
}

socket.on('ss-tweets', function(data) {
//	alert(JSON.stringify(data.tweet));
	var summary = data.summary;
	$('#tot-count').html(summary.total);
	$('#word0-count').html(summary.words[0].count);
	$('#word1-count').html(summary.words[1].count);
	
	if(data.tweet != undefined){
		var tweet = data.tweet;
		var imgHtml = '<span class="bx"><img class="img-rounded" src="' +tweet.pic +'"></span>';
		var tweetHtml = '<span class="bx"><strong>' + tweet.user + ' : </strong>' + tweet.text + '</span>';
		var rowHtml = "<li class='list-group-item'>"+imgHtml + tweetHtml+"</li>"
		if(tweet.key == summary.words[0].word){
			$('#w0tweets').prepend(rowHtml);
		}else if(tweet.key == summary.words[1].word){
			$('#w1tweets').prepend(rowHtml);
		}	
	}
	drawChart(summary.words);
});

function drawChart(data){
	$('#chart').html('');
	var w = 400;
	var h = 400;
	var r = h/2;
	var color = d3.scale.category20c();
	var vis = d3.select('#chart').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
	var pie = d3.layout.pie().value(function(d){return d.count;});

// declare an arc generator function
	var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
	var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
	arcs.append("svg:path")
    .attr("fill", function(d, i){
        return color(i);
    })
    .attr("d", function (d) {
        // log the result of the arc generator to show how cool it is :)
        return arc(d);
    });

// add the text
	arcs.append("svg:text").attr("transform", function(d){
			d.innerRadius = 0;
			d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    return data[i].word + "  (" + data[i].percent + "%)";}
	);
}
