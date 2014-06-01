var Firebase = require('firebase');
var phantom = require('phantom');
var email = require('../../node_modules/emailjs');

//connect to firebase
var db = new Firebase('https://kiwidb.firebaseio.com/');
db.auth(process.env.CRAWLER_AUTH, function(){});//db.auth throws errors, no need for us to do it

//connect to email smtp server
var server;
var connect = function(){ //connects to email server
  server = email.server.connect({
    user: 'thekiwioverlord',
    password: 'kiwisforlife',
    host: 'smtp.gmail.com',
    ssl: 'true'
  });
}
connect();

//declare functions necessary for required phantom activity
var getText = function($node, target) {
    return $node.text();
};

var getTodayInString = function() {
  var today = new Date();
  return today.toString();
};

var warnUser = function(email, url, name){ //sends email to user
  server.send({
    text: "Hey " + name + ", our kiwi runner noticed a kiwi of yours tracking " + url + " got lost. The element the little fella was traking has probably moved. Please set another kiwi on his trail if you still want to track the element.",
    from: 'thekiwioverlord@gmail.com',
    to: email,
    subject: 'One of your kiwis got lost' 
  }, function(err, message){
    console.log(err || message);
  });
}

//declare objects to hold kiwis that need updating
var dispatch = {}; //stores info about deployed phantoms
var queue = []; //stores queue of kiwis for updating
dispatch.counter = 0; //maintains number of kiwis not updated. Program exits when this is 0 again. 
var dataSet = {}; //stores metadata kiwis. Used to populate the queue

//declare functions for populating above objects. Called after firebase sends data
var populateQueue = function(){
  for (var user in dataSet){
    var kiwiList = dataSet[user].kiwis;
    for (var kiwi in kiwiList){
      queue.push(kiwiList[kiwi]);
    }
  }
  console.log(queue);
}

//declare functions to manage phantom scraping activity
var updateAirTraffic = function(){
  if((dispatch.counter < 4) && queue[queue.length-1]){ //maintains maximum four phantoms
    phantomFetch(queue.pop()); //DEFINED AT END OF THIS FILE
    dispatch.counter++;
    console.log('Dispatch phantom ' + dispatch.counter + '. ' + queue.length + ' kiwis remaining.');
  }
}

var activateDispatch = function(){
  setInterval(function(){
    updateAirTraffic();
  }, 200);
}

//this block will populate the dataSet object. We can then decide how to dispatch phantoms.
db.once('value', function(snapshot) {
  console.log('Fetching from Firebae...');
  snapshot.forEach(function(item) {

    for (var user in item.val() ){
      dataSet[user] = {}; //object to store user and associated kiwis
    }

    for(var user in dataSet){
      dataSet[user].email = item.val()[user].email;
      dataSet[user].name = item.val()[user].name;
      dataSet[user].kiwiPath = 'https://kiwidb.firebaseio.com/users/' + user + '/kiwis'; //url to users kiwis
      dataSet[user].firebase = new Firebase(dataSet[user].kiwiPath); //firebase listener on user's kiwi collection
      dataSet[user].kiwis = {}; //to store kiwis, and their associated urls and paths
      
      dataSet[user].firebase.once('value', function(snapshot){ //for each kiwi in the user's collection

        for (var kiwi in snapshot.val()){
          dataSet[this.user].kiwis[kiwi] = {
            email: dataSet[this.user].email,
            path: snapshot.val()[kiwi].path,
            url: snapshot.val()[kiwi].url,
            destination: dataSet[this.user].kiwiPath + '/' + kiwi + '/values'
          };
        }

      }, {user: user}); //end inner once. Note context object passed in here. 
    } //end for loop
  }); //end foreach

  setTimeout(function(){
    populateQueue();
    activateDispatch()
  }, 5000);
  
}); //end once


//phantom routine
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
                  name: kiwi.name,
                  email: kiwi.email,
                  destination: kiwi.destination
                };
              //CALLBACK
              }, function(result) {
                  //email user
                if(result.text.length < 1){
                  warnUser(result.email, result.url, result.name);
                }else{
                  var dataRef = new Firebase(result.destination);
                  dataRef.push({
                    date: getTodayInString(),
                    value: result.text
                  });
                }

                dispatch.counter--;
                if(dispatch.counter === 0){
                  setTimeout(function(){
                    process.exit();
                  }, 5000);
                }

                ph.exit();                  
              }, kiwi);
            // }, 5000);
        }); //end include
      }); //end open
    }); //end createPage
  }); //end create
}

