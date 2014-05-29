var Firebase = require('firebase');
var phantom = require('phantom');

var db = new Firebase('https://kiwidb.firebaseio.com/');

//STORING SECURE SECRET! SUPER HACKY! MUST CHANGE!
db.auth(process.env.CRAWLER_AUTH, function(){}); //not bothering to log error since db.auth will throw if failure


var getText = function($node, target) {
    return $node.text();
};

var getTodayInString = function() {
  var today = new Date();
  return today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
};

var counter = 0;
var dataSet = {};

//this block will populate the dataSet object. We can then decide how to dispatch phantoms.
db.once('value', function(snapshot) {
  snapshot.forEach(function(item) {

    for (var user in item.val() ){
      dataSet[user] = {}; //object to store user and associated kiwis
    }

    for(var user in dataSet){
      dataSet[user].kiwiPath = 'https://kiwidb.firebaseio.com/users/' + user + '/kiwis'; //url to users kiwis
      dataSet[user].firebase = new Firebase(dataSet[user].kiwiPath); //firebase listener on user's kiwi collection
      dataSet[user].kiwis = {}; //to store kiwis, and their associated urls and paths
      
      dataSet[user].firebase.once('value', function(snapshot){ //for each kiwi in the user's collection
        var kiwis = dataSet[user].kiwis; //create pointer to this user's kiwis

        //add all this user's kiwis to that pointer
        for (var kiwi in snapshot.val()){
          kiwis[kiwi] = {
            path: snapshot.val()[kiwi].path,
            url: snapshot.val()[kiwi].url,
            destination: dataSet[user].kiwiPath + '/' + kiwi + '/values'
          };
        }

        for (var kiwi in kiwis){
          counter++;
          phantomFetch(kiwis[kiwi]);
        }

      }); //end inner once
    } //end for loop
  }); //end foreach
}); //end once

var phantomFetch = function(kiwi){
  phantom.create(function(ph) {
    ph.createPage(function(page) {
      page.open(kiwi.url, function(status) {
        page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
            // setTimeout(function() {
              page.evaluate(function(kiwi) {

                text = $(kiwi.path).text();

                return {
                  text: text,
                  url: kiwi.url,
                  path: kiwi.path,
                  destination: kiwi.destination
                };
              //CALLBACK
              }, function(result) {
                var dataRef = new Firebase(result.destination);
                dataRef.push({
                  date: getTodayInString(),
                  value: result.text
                });
                counter--;
                if(counter === 0){
                  setTimeout(function(){
                    process.exit();
                  }, 200);
                }
                ph.exit();

              }, kiwi);
            // }, 5000);

        }); //end include
      }); //end open
    }); //end createPage
  }); //end create
}
