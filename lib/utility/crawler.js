var Firebase = require('firebase');
var phantom = require('phantom');
var email = require('../../node_modules/emailjs');

var db = new Firebase('https://kiwidb.firebaseio.com/');

db.auth(process.env.CRAWLER_AUTH, function(){});//db.auth throws errors, no need for us to do it

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

var getTodayInString = function() {
  return new Date();
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

var counter = 0; //maintains number of kiwis not updated. Program exits when this is 0 again. 
var dataSet = {}; //stores metadata about update pattern in memory

//this block will populate the dataSet object. We can then decide how to dispatch phantoms.
db.once('value', function(snapshot) {
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

        for (var kiwi in dataSet[this.user].kiwis){
          counter++;
          console.log(counter);
          phantomFetch(dataSet[this.user].kiwis[kiwi]);
        }

      }, {user: user}); //end inner once. Note context object passed in here. 
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
                  name: kiwi.name,
                  email: kiwi.email,
                  destination: kiwi.destination
                };
              //CALLBACK
              }, function(result) {
                console.log(result.destination);
                if(result.text.length < 1){ //email user
                  warnUser(result.email, result.url, result.name);
                }else{
                  var dataRef = new Firebase(result.destination);
                  dataRef.push({
                    date: getTodayInString(),
                    value: result.text
                  });
                }

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

