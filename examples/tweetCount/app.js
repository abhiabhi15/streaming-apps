var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var parser = require("./lib/parser");
var MyTwitter = require('./lib/twitter');

var words = [];
var names = parser.names();
names.forEach(function(name){
	words.push(name.toLowerCase());
});

if(words.length < 2){
	console.log('\n [ERROR] Two args are needed : node app.js word1 word2 \n');
	process.exit();
}
// Setting words for twitter Streaming API
var myTwitter = new MyTwitter(words);
myTwitter.startStreaming();

var app = express();
var server = require('http').createServer(app);
var port = 3000;
server.listen(3000);
console.log("Socket.io server listening at http://127.0.0.1: " + port);

var sio = require('socket.io').listen(server);
sio.sockets.on('connection', function(socket){

	console.log('Web client connected');
	
	socket.on('disconnect', function(){
	     console.log('Web client disconnected');
	});
	
	socket.emit('ss-words',words);
	
	// Sending current customized tweet-json on the browser with certain time Interval
	setInterval(function(){
		socket.emit('ss-tweets', myTwitter.getTweetJson());
		}, 500+Math.round(100*Math.random())
	);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
