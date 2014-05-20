
var Firebase = require('firebase');
var phantom = require('phantom');
var request = require('request');
var $ = require('jquery');

var db = new Firebase('https://kiwidb.firebaseio.com/');
debugger;


console.log('yoyo');
db.once('value', function(snapshot) {
  snapshot.forEach(function(item) {
    var lookup = item.val();


    console.log('url: ', lookup.url);
    request('http://www.imdb.com/title/tt1229340/', function(err, resp, html) {
        if (err)
            throw err;

        var $html = $(html + "");

        console.log('lookup.path:', lookup.path);
        var $target = $html.find(lookup.path);
        var text = $target.text();
        debugger;
        // console.log(pool);
        // TODO: scraping goes here!
        // var value = $(lookup.path).text();
        // if(value !== lookup.text) {
        //     console.log('we got a different value');
        // }
    });


  });
});

// 