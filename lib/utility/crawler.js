var Firebase = require('firebase');
var phantom = require('phantom');

var db = new Firebase('https://kiwidb.firebaseio.com/');

//STORING SECURE SECRET! SUPER HACKY! MUST CHANGE!
db.auth('4sMMNGVsvzGbQgTcuTnpOmD7ZUb3JSFsjelHrhaj', function(){
  console.log('authentication successful: '); 
}); //not bothering to log error since db.auth will throw if failure


/*var getText = function($node, target) {
    return $node.text();
};

var getTodayInString = function() {
  var today = new Date();
  return today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
};*/

var lookups = {};
var dataSet = {};

db.once('value', function(snapshot) {
  snapshot.forEach(function(item) {
    var lookup = item.val();

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

        //we now have each user's kiwis in dataSet[user].kiwis (which is an object who's keys are kiwi hashes)
        //beginning phantom stuff...
      });
    }


    //console.log('ref(): ', item.ref().path.m[0]);


    /*var temp = lookup.url.toString(); //create string out of lookup url
    lookups[temp] = true; //create reference to that string in lookups obj
*/
    /*phantom.create(function(ph) {
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
                  // var ref = item.ref().path.m[0];
                  // var fullRef = "https://kiwidb.firebaseio.com/" + ref + "/values";
                  // var dataRef = new Firebase(fullRef);
                  // dataRef.push({
                  //   date: getTodayInString(),
                  //   value: result.text
                  // });
                  //delete lookups[temp];

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
    }); //end create*/

  }); //end foreach
}); //end once