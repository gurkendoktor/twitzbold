var param = process.argv[2];
if(!param){
	param = "foobar";
}

console.log('filtering for ' + param);

var io = require('socket.io').listen(8081);
var mySocket;
var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: '1cAy3h3MM4a9smAxbAfGbMbB4',
  consumer_secret: '0G4SRDAdESKvb7umNIxpm7n9YxxMBQ8q1KGniTKn4KolzeE5FH',
  access_token_key: '44620716-cXvC5x3lHZEyEQ2JTGH3jcnkt1wLIkZJ3pH9yJFaW',
  access_token_secret: 'NhUiExYgcZg3N49GSGQtqZ3oWoyjMo1uuWyyBLkqOEWoP'
});

io.sockets.on('connect',function(socket){
	mySocket = socket;
});

client.stream('statuses/filter', {track: param}, function(stream) {
  console.log('param = '+param);
  var i=0;
  stream.on('data', function(tweet) {
   socket.broadcast.emit('tweet',tweet.text);
   console.log(tweet.text);
   i++;
   if(i % 100 == 0){
	console.log(i);
	}
  });
 
  stream.on('error', function(error) {
    throw error;
  });
});
