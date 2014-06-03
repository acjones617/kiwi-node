/*Add dependencies and authenticate Firebase*/
var express = require('express');
var Firebase = require('firebase');
var db = new Firebase('https://kiwidb.firebaseio.com/users');
db.auth(process.env.CRAWLER_AUTH, function(){});//db.auth throws errors, no need for us to do it

var app = express();
app.listen(3000);

var queue = [];
var rampUp = false;
var maxAge = 120000; 

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
			console.log('Queue loop. ' + hash + ' rejected. Ramping workers...');
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

setInterval(function(){
	enqueue();
}, 500);