var Firebase = require('../node_modules/firebase');
var phantom = require('../node_modules/phantom');
var email = require('../node_modules/emailjs');

//connect to firebase
var db = new Firebase('https://kiwidb.firebaseio.com');
db.auth('SCSHCPfXFlE7C8U40k1uZCYCHCDKyf2XjPoA9dxh', function(){});//db.auth throws errors, no need for us to do it

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
    text: "Hey " + name + ", our kiwi runner noticed a kiwi of yours tracking " + url + " got lost. We won't be able to track this one. We're not spammers so you won't get any more messages about lost kiwis.",
    from: 'thekiwioverlord@gmail.com',
    to: email,
    subject: 'One of your kiwis got lost' 
  }, function(err, message){
    console.log(err);
  });
}

var sendCrawlStats = function(){
  server.send({
    text: 'Crawl initiated at: ' + startTime + "; \n" +
          totalTargets + ' kiwis targetted; \n' +
          warnings + ' targets missed; \n' +
          'Missed targets: ' + missed + '\n'+
          'Shut down at ' + new Date(),
    to: 'thekiwioverlord@gmail.com',
    from: 'thekiwioverlord@gmail.com',
    subject: 'Crawl stats from: ' + startTime
  }, function(err, message){
    console.log(err || message);
  });
}

//declare objects to hold kiwis that need updating
var startTime = new Date();
var dispatch = {}; //stores info about deployed phantoms
var totalTargets = 0;
var missed = [];
var queue = []; //stores queue of kiwis for updating
dispatch.counter = 0; //maintain number of dispatched phantoms
var dataSet = {}; //stores metadata kiwis. Used to populate the queue
var warnings = 0; //stores number of warning emails sent
var listeners = 0; //stores number of responses from firebase before populating queue. 

//declare functions for populating above objects. Called after firebase sends data
var populateQueue = function(){
  for (var user in dataSet){
    var kiwiList = dataSet[user].kiwis;
    for (var kiwi in kiwiList){
      queue.push(kiwiList[kiwi]);
    }
  }
  totalTargets = queue.length;
  console.log(queue.length + ' kiwis to crawl.');
}

//declare functions to manage phantom scraping activity
var updateAirTraffic = function(){
  if((dispatch.counter < 4) && queue[queue.length-1]){ //maintains maximum one phantom
    dispatch.counter++;
    console.log(queue.length + ' kiwis remaining. ' + warnings + ' targets missed.')
    console.log('Dispatched phantom. Now fetching kiwi at ' + queue[queue.length-1].destination);
    phantomFetch(queue.pop()); //DEFINED AT END OF THIS FILE
  }
}

var activateDispatch = function(){ //sends out a phantom when the fourth one returns. 
  setInterval(function(){
    updateAirTraffic();
  }, 200);
}

//this block will populate the dataSet object. Above two functions then decide how to dispatch phantoms.
db.once('value', function(snapshot) {
  console.log('Firebase connection established.');
  snapshot.forEach(function(item) {
    if(item.name() === 'users'){

      for (var user in item.val() ){
          dataSet[user] = {}; //object to store user and associated kiwis
      }
      
      for(var user in dataSet){
        dataSet[user].notified = item.val()[user].settings.notified;
        dataSet[user].email = item.val()[user].settings.email;
        dataSet[user].name = item.val()[user].settings.name;
        dataSet[user].kiwiPath = 'https://kiwidb.firebaseio.com/users/' + user + '/kiwis'; //url to user's kiwis
        dataSet[user].firebase = new Firebase(dataSet[user].kiwiPath); //firebase listener on user's kiwi collection
        dataSet[user].kiwis = {}; //to store kiwis, and their associated urls and paths
        listeners++;
        dataSet[user].firebase.once('value', function(snapshot){ //for each kiwi in the user's collection
          listeners--;

          for (var kiwi in snapshot.val()){ //sets relevant info for each kiwi in dataset
            dataSet[this.user].kiwis[kiwi] = {
              name: dataSet[this.user].name,
              user: this.user,
              email: dataSet[this.user].email,
              notified: dataSet[this.user].notified,
              path: snapshot.val()[kiwi].path,
              url: snapshot.val()[kiwi].url,
              destination: dataSet[this.user].kiwiPath + '/' + kiwi + '/values'
            };
          }

          if(!listeners){
            setTimeout(function(){ //populate queue some seconds after first listener established
              populateQueue();
              activateDispatch()
            }, 5000);
            
          }
        }, {user: user}); //end inner once. Note context object passed in here. 
      } //end for loop
    } //end if statement
  }); //end foreach

  
}); //end once


//closing routine for phantom. Procedure for clean exit sans orphan phantom processes. 
var shutDown = function(passedIn, phantom){
  dispatch.counter--;
  if(dispatch.counter === 0){
    sendCrawlStats();
    console.log('Crawl complete. Shuttings down and gathering crawl stats.');
    setTimeout(function(){
      console.log(totalTargets + ' kiwis targetted.');
      console.log(warnings + ' targets missed.');
      console.log('Missed targets: ', missed);
      console.log('Shut down.');
      process.exit();
    }, 8000); //allow phantoms time to exit and end processes. reduces risk of memory leak.
  }
  phantom.exit(); 
}

//phantom routine
var phantomFetch = function(kiwi){
  phantom.create(function(ph) {
    ph.createPage(function(page) {
      page.open(kiwi.url, function(status) {

        page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js', function() {
              page.evaluate(function(kiwi) {
                if(!$ && jQuery){
                  var $ = jQuery;
                }

                text = $(kiwi.path).text().trim(); //fetch user's element from page

                return { //populate return object; required for logical actions in callback
                  user: kiwi.user,
                  text: text,
                  url: kiwi.url,
                  path: kiwi.path,
                  name: kiwi.name,
                  email: kiwi.email,
                  notified: kiwi.notified,
                  destination: kiwi.destination
                };
              //CALLBACK
              }, function(result) {
                if(result.text.length < 1 && result.notified === 'false'){ //bad data: email user and exit phantom
                  warnings++;
                  missed.push(result.destination);
                  warnUser(result.email, result.url, result.name);
                  var settingsRef = new Firebase('https://kiwidb.firebaseio.com/users/' + result.user + '/settings');
                  settingsRef.update({notified: 'true'}, function(){
                    shutDown(null, ph);
                  });
                }else if(result.text.length < 1){ //bad data: User already informed. Just exit phantom
                  warnings++;
                  missed.push(result.destination);
                  shutDown(null, ph);
                }else{ //good data. write to firebase and exit phantom. 
                  console.log('Phantom returning target: ' + result.text);
                  var dataRef = new Firebase(result.destination);
                  dataRef.push({
                    date: getTodayInString(),
                    value: result.text
                  }, function(){
                    shutDown(null, ph);
                  });
                }
 
              }, kiwi);
        }); //end include
      }); //end open
    }); //end createPage
  }); //end create
}

