var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

// Initializing Redis Server
var redis = require('redis');
var redis_client = redis.createClient( 6379, '127.0.0.1');

redis_client.on('error', function(err){
	console.log('Error' + err);
	exit(1);
});

console.log("Redis Client Connected Successfully");

var app = express();
var server = require('http').createServer(app);
var port = 3000;

server.listen(3000);
console.log("Socket.io server listening at http://127.0.0.1: " + port);

// Initializa a socket-io object
var sio = require('socket.io').listen(server); 

// Initializing the default guest count
var guestCount = 1;

// Generating the default name for user
function getDefaultName(){
	var guestNo = guestCount;
	return "guest" + guestNo; 
}

sio.sockets.on('connection', function(socket){

	// After connection with client
	console.log('Web client connected');

	// Emitting default name to user
	var defaultName = getDefaultName();
    socket.emit('welcome', defaultName);
	
	// Checking if the new client connection, is new or old
	socket.on("confirm", function(type){
		if(type == "new"){ // If new then incrementing guest count
			guestCount++;
		}
	});

	/*
		Now Emitting the chat history to the new user,
		fetching chat history from Redis Server
	*/
	redis_client.lrange('chat-msgs', -100 , 100, function(err, chats){
		if(err) throw err;
		chats.forEach(function(msg){
			socket.emit('oldChats', msg);
		});
	});

    // After the client is disconnected
	socket.on('disconnect', function(){
		console.log('Web client disconnected');
	});
	
	// Chat Message from client
	socket.on('chat-msg', function(msg){
		console.log('Client Responded :' + msg);
		redis_client.rpush('chat-msgs', msg, redis.print);
		broadcast(msg);
	});

	//Broadcasting messages to all connected clients
	function broadcast(msg){
		sio.sockets.emit("broadcast", { text : msg});
	}

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
