
var _ = require('underscore');
var Firebase = require('firebase');
var env = require('jsdom').env;

var db = new Firebase('https://kiwidb.firebaseio.com/');

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
    var hasInvalid = false;
    var lookup = item.val();
    var temp = lookup.url.toString(); //create string out of lookup url
    var values = lookup.values;
    _.each(values, function(record, key) {
      if(record.value === '') {
        invalidCount++;
      }
    })
    total++;
  }); //end foreach
  console.log('total: ', total, ' invalid: ', invalidCount, ' percentage: ', ((total - invalidCount) / total) * 100);
  process.exit();
}); //end once

