/*Incomplete file. Code from old node.io library. 
Aborted for following reasons:
1. Non-phantom loading (using 'request') is sometimes rejected by websites
2. Returned values frequently include script tags. These scripts are not executed so
	dynamically-loaded content is not loaded. This substantially increases the fuckup rate of the crawler.
*/

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var format = require('util').format;
var Firebase = require('firebase');
var email = require('../../node_modules/emailjs');

var db = new Firebase('https://kiwidb.firebaseio.com/');

db.auth(process.env.CRAWLER_AUTH, function(){});//db.auth throws errors, no need for us to do it

var server;

var connect = function(){ //connects to email server
  server = email.server.connect({
    user: 'thekiwioverlord',
    password: 'kiwisforlife',
    host: 'smtp.gmail.com',
    ssl: 'true'
  });
}

connect();

var getText = function($node, target) {
    return $node.text();
};

var getTodayInString = function() {
  var today = new Date();
  return today.toString();
};

var warnUser = function(email, url, name){ //sends email to user
  server.send({
    text: "Hey " + name + ", our kiwi runner noticed a kiwi of yours tracking " + url + " got lost. The element the little fella was traking has probably moved. Please set another kiwi on his trail if you still want to track the element.",
    from: 'thekiwioverlord@gmail.com',
    to: email,
    subject: 'One of your kiwis got lost' 
  }, function(err, message){
    console.log(err || message);
  });
}

var dispatch = {}; //stores info about deployed phantoms
var queue = [];

dispatch.counter = 0; //maintains number of kiwis not updated. Program exits when this is 0 again. 
var dataSet = {}; //stores metadata about update pattern in memory

var populateQueue = function(){
  for (var user in dataSet){
    var kiwiList = dataSet[user].kiwis;
    for (var kiwi in kiwiList){
      if(kiwi === "-JOG6NqxSzOsh5CpM64c"){
        queue.push(kiwiList[kiwi]);
      }
    }
  }
  console.log(queue);
}

var updateAirTraffic = function(){
  if((dispatch.counter < 4) && queue[queue.length-1]){
    phantomFetch(queue.pop());
    dispatch.counter++;
    console.log('Dispatch phantom ' + dispatch.counter);
  }
}

var activateDispatch = function(){
  setInterval(function(){
    updateAirTraffic();
  }, 200);
}

//this block will populate the dataSet object. We can then decide how to dispatch phantoms.
db.once('value', function(snapshot) {
  console.log('Fetching from Firebae...');
  snapshot.forEach(function(item) {

    for (var user in item.val() ){
      dataSet[user] = {}; //object to store user and associated kiwis
    }

    for(var user in dataSet){
      dataSet[user].email = item.val()[user].email;
      dataSet[user].name = item.val()[user].name;
      dataSet[user].kiwiPath = 'https://kiwidb.firebaseio.com/users/' + user + '/kiwis'; //url to users kiwis
      dataSet[user].firebase = new Firebase(dataSet[user].kiwiPath); //firebase listener on user's kiwi collection
      dataSet[user].kiwis = {}; //to store kiwis, and their associated urls and paths
      
      dataSet[user].firebase.once('value', function(snapshot){ //for each kiwi in the user's collection

        for (var kiwi in snapshot.val()){
          dataSet[this.user].kiwis[kiwi] = {
            email: dataSet[this.user].email,
            path: snapshot.val()[kiwi].path,
            url: snapshot.val()[kiwi].url,
            destination: dataSet[this.user].kiwiPath + '/' + kiwi + '/values'
          };
        }

      }, {user: user}); //end inner once. Note context object passed in here. 
    } //end for loop
  }); //end foreach

  setTimeout(function(){
    populateQueue();
    activateDispatch()
  }, 5000);
  
}); //end once

async.eachLimit(queue, 2, function (kiwi, next) {
    request(kiwi.url, function (err, response, body) {
        if (err) throw err;
        var $ = cheerio.load(body);
        $(kiwi.path).each(function () {
            console.log('%s (%s)', $(this).text(), $(this).attr('href'));
        });
        next();
    });
});















