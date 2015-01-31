var server_name = "http://127.0.0.1:3000/";
var socket = io.connect(server_name);
socket.on('ss-ping', function(data) {
	if(data.text == 'PING'){
		var msgText = 'Server : ' + data.text;
		$('#ss-message').hide();
		$('#cr-message').hide();
		$('#ss-message').fadeIn(2000);
		$('#ss-message').html(msgText);
		
		console.log('Client: Received server message: '+data.text);
		socket.emit('cs-pong','PONG');
		msgText = 'Client : PONG';
		$('#cr-message').delay(1000).fadeIn(2000);
		$('#cr-message').html(msgText);
	}
});

socket.on('ss-pong', function(data){
	if(data.text == 'PONG'){
		console.log('Client: Received server message: '+data.text);
	}	
	var msgText = 'Server : PONG';
	$('#sr-message').delay(1000).fadeIn(2000);
	$('#sr-message').html(msgText);
});


$('#ping').click(function(){
	socket.emit('cs-ping', 'PING');
	var msgText = 'Client : PING';
	$('#cs-message').hide();
	$('#sr-message').hide();
	$('#cs-message').fadeIn(2000);
	$('#cs-message').html(msgText);

});
