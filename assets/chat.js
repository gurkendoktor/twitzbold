/**
 * Created with IntelliJ IDEA.
 * User: matze
 * Date: 25.06.12
 * Time: 18:27
 * To change this template use File | Settings | File Templates.
 */


function Chat(socket) {
	var user;
	var chatbox;
	var socket;

	var userlist = [];

	if(socket) {
		socket = socket;
	}

	this.init = function (user, chatBoxItem, msgBoxItem, userList) {
		user = user;
		chatbox = chatBoxItem;
		chatbox.addEventListener("keydown", onKeyPress);
		//we have the chat, let's send user data to the server
		socket.emit('chatready',user);

		socket.on('join',function(data){
			$(userList).append('<p id ="' + data.id + '">'+data.nick+'</p>');
		});

		socket.on('userleft', function(data){
			$("#"+data.id).remove();
		});

		socket.on('message', function(data){
			$(msgBoxItem).append('<div class="message">' + data + '</div>');
		});
	}



	updateUserList = function (data) {
		console.log('update users');
		console.log(data);
	};


	function onKeyPress(e) {
		switch (e.keyCode) {
			case 13:
				onChatSubmit(e.target.value);
				e.target.value = '';
				break;
			case 27:
				e.target.value = '';
				break;
		}
	}

	function onChatSubmit(value) {
		if (!value) {
			return;
		}
		console.log(value);
		socket.emit('message', {nickname : this.user.nickname, message : value});
	}




}