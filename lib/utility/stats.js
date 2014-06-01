
var _ = require('underscore');
var Firebase = require('firebase');
var env = require('jsdom').env;

var db = new Firebase('https://kiwidb.firebaseio.com/users/facebook%3A10152047898217251/kiwis');
db.auth(process.env.CRAWLER_AUTH, function(){});//db.auth throws errors, no need for us to do it

/**
 * Get analysis on the shit
 * If data is not empty
 *   count++
 * Display percentage
 */

var total = 0;
var invalidCount = 0;

db.once('value', function(snapshot) {
  snapshot.forEach(function(item) {
    var hasBeenAccountedFor = false;
    var lookup = item.val();
    var temp = lookup.url.toString(); //create string out of lookup url
    var values = lookup.values;
    _.each(values, function(record, key) {
      if(record.value === '' && !hasBeenAccountedFor) {
        invalidCount++;
        hasBeenAccountedFor = true;
      }
    });
    total++;
  }); //end foreach
  console.log('total: ', total, ' invalid: ', invalidCount, ' percentage: ', ((total - invalidCount) / total) * 100);
  process.exit();
}); //end once
