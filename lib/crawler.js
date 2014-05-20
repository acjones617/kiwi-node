
var Firebase = require('firebase');
var phantom = require('phantom');
var request = require('request');
var env = require('jsdom').env;


var db = new Firebase('https://kiwidb.firebaseio.com/');

var getText = function($node, target) {
    return $node.text();
};

db.once('value', function(snapshot) {
  snapshot.forEach(function(item) {
    var lookup = item.val();


    console.log('url: ', lookup.url);
    request(lookup.url, function(err, resp, html) {
        if (err)
            throw err;

        env(html, function (errors, window) {

            var $ = require('jquery')(window);

            // var $html = $(html);

            console.log('lookup.path:', lookup.path);


            var $target = $(lookup.path);
            var text = getText($target);
            debugger;
            console.log('target node: ', $target);
            console.log('target text:', text);
            // console.log(pool);
            // TODO: scraping goes here!
            // var value = $(lookup.path).text();
            // if(value !== lookup.text) {
            //     console.log('we got a different value');
            // }

        });
    });


  });
});


//
