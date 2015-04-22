var server_name = "http://127.0.0.1:3000/";
var socket = io.connect(server_name);

// Welcome message and user nickname settings with cookie
socket.on('welcome', function(user){
	
	var cookieUser = $.cookie("user");
	
	if(cookieUser === undefined){
		socket.emit("confirm", "new");
		$.cookie("user", user);
		var text = "<h4>Welcome in the Chatroom Server : " + user + "</h4>";
		text += " You can change your nickname <br/>";
		$("#welcome").html(text);
		$("#welcome").fadeOut(8000);
	}else{
		socket.emit("confirm", "old");
	}

});	

// Showing chats
socket.on('broadcast', function(data){
 	$('#content').append(data.text + '<br/>');
});

//Showing chat history
socket.on('oldChats', function(data){
    $('#content').append(data + '<br/>');
});

// On Enter Key, displaying chat via server
$("#chatmsg").keyup(function (e) {
    if (e.keyCode == 13) {
		var txt = $("#chatmsg").val();
		$("#chatmsg").val("");
		var msg = $.cookie("user") + ": " + txt;
		socket.emit('chat-msg', msg);
	}
});

// Setting Nickname
$("#setname").click(function(){
	var newNickname = $("#nickname").val();
	if($.trim(newNickname) == ""){
		alert("Nickname cannot be empty");
		return;
	}
	var msg =  $.cookie("user") + ' has new nickname : ' + newNickname;
	$.cookie("user", newNickname);
    $("#nickname").val("");
	socket.emit('chat-msg', msg);

});

// Deleting cookie on browser close
$(window).unload(function() {
	$.removeCookie("user");
});
