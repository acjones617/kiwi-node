
var Firebase = require('firebase');
var phantom = require('phantom');
var request = require('request');
var env = require('jsdom').env;


var db = new Firebase('https://kiwidb.firebaseio.com/');

var getText = function($node, target) {
    return $node.text();
};

var getTodayInString = function() {
  var today = new Date();
  return today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
};

db.once('value', function(snapshot) {
  snapshot.forEach(function(item) {
    var lookup = item.val();

    phantom.create(function(ph) {
      ph.createPage(function(page) {
        page.open(lookup.url, function(status) {

          page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
              // setTimeout(function() {
                page.evaluate(function(lookup) {
                  var text = "";
                  // text = $(lookup.path).text(); //always get the first value
                  var lookup = $(lookup.path);
                  // if(lookup.length > 1) {
                    // text = $(lookup.path)[0].innerHTML;
                  // } else {
                    text = $(lookup.path).text();
                  // }

                  return {
                    text: text,
                    lookup: lookup,
                    path: lookup.path
                  };
                }, function(result) {
                  var ref = item.ref().path.m[0];
                  var fullRef = "https://kiwidb.firebaseio.com/" + ref + "/values";
                  var dataRef = new Firebase(fullRef);
                  dataRef.push({
                    date: getTodayInString(),
                    value: result.text
                  });

                  /*
                    lines 42-48 successfully push to fire base, except the
                    keys are randomly-generated hashes, and not numerical
                    indices like we want them to be. 
                  */

                  ph.exit();
                }, lookup);
              // }, 5000);

          });
        });
      });
    });
  });
});

