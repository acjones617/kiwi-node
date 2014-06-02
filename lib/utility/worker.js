/*General application dependencies*/
var express = require('express');
var phantom = require('phantom');
var email = require('../../node_modules/emailjs');
var request = require('request');
var crawler = require('./crawlerMethods.js');

/*Firebase dependencies*/
var Firebase = require('firebase');
var db = new Firebase('https://kiwidb.firebaseio.com/users');
db.auth(process.env.CRAWLER_AUTH, function(){});//db.auth throws errors, no need for us to do it

/*Initialise worker*/
var app = express();

var getWork = function(){
	request.get('http://localhost:3000', function (error, response, body) {
	  if (!error && response.statusCode === 200) {
	  	if(Object.keys(JSON.parse(response.body)).length){
		  	work(response);
	  	}
	  }
	});
}

var work = function(response){
	var effort = JSON.parse(response.body).effort;
	var data = JSON.parse(response.body).data;
	balancePhantoms(effort);
	if(data){
		crawler.populate(data);
	}
}

var balancePhantoms = function(effort){
	if(crawler.phantoms<4 && crawler.phantoms>0){
		crawler.phantoms = crawler.phantoms + effort;
		console.log('adjusted phantoms to: ' + crawler.phantoms);
	}
}

setInterval(function(){
	if(!crawler.working){
		getWork();
	}
}, 500);