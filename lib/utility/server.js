/*Add dependencies and authenticate Firebase*/
var express = require('express');
var Firebase = require('firebase');
var db = new Firebase('https://kiwidb.firebaseio.com/users');
db.auth(process.env.CRAWLER_AUTH, function(){});//db.auth throws errors, no need for us to do it

var app = express();
app.listen(process.env.PORT || 3000);

var queue = [];
var rampUp = false;
var maxAge = 600000; 

app.get('/', function(req, res){
	var parcel = queue.shift();
	res.send({data: parcel, effort: rampUp});
	if(parcel){
		console.log('Dispatched ' + Object.keys(parcel) );
	}
});

var enqueue = function(){
	var priorityLimit = Date.parse(new Date()) - maxAge;
	db.endAt(priorityLimit).limit(1).on('child_added', function(childSnapshot) {
		
		rampUp = existsInQueue(childSnapshot, queue);
		var hash = childSnapshot.name();

		if(rampUp < 1){
			var parcel = {};
			parcel[hash] = childSnapshot.val();
			queue.push(parcel);
			console.log('Enqueued ' + Object.keys(parcel)[0]);
			resetPriority(childSnapshot);
		}else{
			console.log('Queue loop. ' + hash + ' rejected.');
		}
	});
}

var resetPriority = function(snapshot){
	var name = snapshot.name();
	var url = 'https://kiwidb.firebaseio.com/users/' + name;
	var updateLink = new Firebase(url);
	var priority = Date.parse(new Date());
	updateLink.setPriority(priority);
}

var existsInQueue = function(snapshot, queue){
	if(queue.length){
		var hash = snapshot.name();
		for (var i=0; i<queue.length; i++){
			var item = Object.keys(queue[i])[0];
			if(hash === item){
				return 1;
			}
		}
		return 0;
	}
	return -1;
}

var authenticate = function(req){
	var secret = req;
	console.log(secret);
}

setInterval(function(){
	enqueue();
}, 10000);

var tokens = {
	'c916d142f0dc7f9389653a164f1d4e9d': true,
	'42704700b5b89880e956d80f046ce934': true, 
	'227ebacb7569b29af9e6b5fcfdd27f45': true,
};