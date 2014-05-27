
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

var lookups = {};

db.once('value', function(snapshot) {
  snapshot.forEach(function(item) {
    var lookup = item.val();
    var temp = lookup.url.toString(); //create string out of lookup url
    lookups[temp] = true; //create reference to that string in lookups obj

    phantom.create(function(ph) {
      ph.createPage(function(page) {
        page.open(lookup.url, function(status) {

          page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
              // setTimeout(function() {
                page.evaluate(function(lookup) {
                  var text = "";
                  text = $(lookup.path).text();

                  return {
                    text: text,
                    lookup: lookup,
                    path: lookup.path,
                  };
                //CALLBACK
                }, function(result) {
                  var ref = item.ref().path.m[0];
                  var fullRef = "https://kiwidb.firebaseio.com/" + ref + "/values";
                  var dataRef = new Firebase(fullRef);
                  dataRef.push({
                    date: getTodayInString(),
                    value: result.text
                  });
                  delete lookups[temp];

                  ph.exit();

                  // if(Object.keys(lookups).length === 0){
                  //   process.exit(); //exit when lookups object is empty (i.e., all
                  //                   //evaluate functions have finished their callback
                  // }                 //phase
                }, lookup);
              // }, 5000);

          }); //end include
        }); //end open
      }); //end createPage
    }); //end create
  }); //end foreach
}); //end once

