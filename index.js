var param = process.argv[2];
if(!param){
	param = "foobar";
}

console.log('filtering for ' + param);

var io = require('socket.io').listen(8081);
var mySocket;
var sockets = [];
var keywords = [];
var interval = 2000;

var Twitter = require('node-tweet-stream')
  , t = new Twitter({
    consumer_key: '1cAy3h3MM4a9smAxbAfGbMbB4',
    consumer_secret: '0G4SRDAdESKvb7umNIxpm7n9YxxMBQ8q1KGniTKn4KolzeE5FH',
    token: '44620716-cXvC5x3lHZEyEQ2JTGH3jcnkt1wLIkZJ3pH9yJFaW',
    token_secret: 'NhUiExYgcZg3N49GSGQtqZ3oWoyjMo1uuWyyBLkqOEWoP'
  });
 

keywords.push(param);
/*
var client = require('node-tweet-stream'),
t = new Twitter({
  consumer_key: '1cAy3h3MM4a9smAxbAfGbMbB4',
  consumer_secret: '0G4SRDAdESKvb7umNIxpm7n9YxxMBQ8q1KGniTKn4KolzeE5FH',
  access_token_key: '44620716-cXvC5x3lHZEyEQ2JTGH3jcnkt1wLIkZJ3pH9yJFaW',
  access_token_secret: 'NhUiExYgcZg3N49GSGQtqZ3oWoyjMo1uuWyyBLkqOEWoP'
});

*/


io.sockets.on('connection',function(socket){

	
	socket.on('keyword', function(data){
		console.log('keyword');
		param = data;
		keywords.push(data);
		t.track(data);
		console.log(data);
	});
	
	socket.on('untrack', function(data){
		console.log('keyword');
		param = data;
		t.untrack(data);
		console.log(data);
	});
	
	socket.on('stop', function(data){
		console.log('keyword');
		while(keyword = keywords.pop()){
			t.untrack(keyword);		
			console.log('untracking '+keyword);
		}
		console.log(keywords);
	});

	
});


var i=0;
var j=0;

t.on('tweet', function (tweet) {
	io.sockets.emit('tweet',tweet.text);
	i++;
	if(i % 100 == 0){
		console.log(i);
	}
});

t.on('error', function (err) {
  io.sockets.emit('clienterror','error');
  console.log('Oh no')
})

t.on('reconnect', function(reconnect){
	console.log('reconnect');
  if(reconnect.type == 'rate-limit'){
    // do something to reduce your requests to the api
  }
});

t.track('cocoa');

countTweets = function(){
	var delta = i-j;
	j=i;
	var rate = delta / (interval/1000);
	io.sockets.emit('rate',rate);
	console.log(rate);
}

setInterval(countTweets, interval);


/*client.stream('statuses/filter', {track: param}, function(stream) {
  console.log('param = '+param);
  var i=0;
  stream.on('data', function(tweet) {
		io.sockets.emit('tweet',tweet.text);
	 
		i++;
	   if(i % 100 == 0){
			console.log(i);
		}
  });
 
  stream.on('error', function(error) {
    throw error;
  });*/

