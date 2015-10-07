var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').createServer(app);
var port = 3000;
server.listen(3000);
console.log("Socket.io server listening at http://127.0.0.1: " + port);

// Initializa a socket-io object
var sio = require('socket.io').listen(server); 

sio.sockets.on('connection', function(socket){

	// After connection with client
	console.log('Web client connected');

	// After the client is disconnected
	socket.on('disconnect', function(){
		console.log('Web client disconnected');
	});
	
	// Pong response from client
	socket.on('cs-pong', function(msg){
		console.log('Client Responded :' + msg);
	});

	// Ping request from client
	socket.on('cs-ping', function(msg){
		console.log('Client Says ' + msg);
		var server_response = 'PONG';
		// Server's response of client's ping
		socket.emit('ss-pong', {text : server_response});
		console.log('Server Responded ' + server_response);
	});

	// Server sending Ping at every 5-10 seconds interval
	setInterval(function(){
		var msg = 'PING';
	    console.log('Server says ' + msg);
		socket.emit('ss-ping',{text : msg});
	}, 5000+Math.round(5000*Math.random()));
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
