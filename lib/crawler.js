
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
          // console.log("opened site? ", status);

          page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
              // setTimeout(function() {
                console.log('under path: ', lookup.path);
                page.evaluate(function(lookup) {
                  var text = "";
                  text = $(lookup.path).text();

                  return {
                    text: text,
                    lookup: lookup,
                    path: lookup.path
                  };
                }, function(result) {
                  // console.log('thing: ', lookup);
                  lookup.values.push({
                    date: getTodayInString(),
                    value: result.text
                  });

                  var values = lookup.values;
                  // lookup.set({ values: values });

                  // db.update()

                  console.log('result', result);
                  ph.exit();
                }, lookup);
              // }, 5000);

          });
        });
      });
    });
  });
});

