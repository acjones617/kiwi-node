'use strict';

var Firebase = require('firebase');
var sentiment = require('sentiment');

exports.sentimentalise = function(req, res){
  var values = req.body;
  for(var i=0; i<values.length; i++){
    var sents = sentiment(values[i].value);
    values[i].score = sents.score;
  }
  res.send(values);
};

exports.getKiwis = function(req, res) {
  var db = new Firebase('https://kiwidb2.firebaseio.com/');
  var result = [];
  var email = req.params.email;
  if(!email) {
    res.redirect('404');
  }
  db.once('value', function(snapshot) {
    snapshot.forEach(function(item) {
      var kiwi = item.val();
      if(kiwi.email === email) {
        result.push(kiwi);
      }
    });
    res.send(result);
  });
};

exports.sendUser = function(req, res){
  var uid = req.body.uid;
  var db = new Firebase('https://kiwidb.firebaseio.com/users');

  //SUPER SECRET! SET TO ENV VARIABLE! MUST DO! IMPERATIVE! VITAL! 
  //OR IMMEDIATE STREET JUSTICE!
  db.auth('4sMMNGVsvzGbQgTcuTnpOmD7ZUb3JSFsjelHrhaj', function(){
  });

  var writeUser = function(){
    var obj = {};
    obj[uid] = 
      {
        settings: {
          name: req.body.thirdPartyUserData.first_name,
          gender: req.body.thirdPartyUserData.gender,
          fullName: req.body.thirdPartyUserData.name,
          timeZone: req.body.thirdPartyUserData.timezone,
          facebook: req.body.thirdPartyUserData.link,
          kiwiCount: 20,
          email: false,
          notified: false,
        },
        premiumSettings: {
          premium: false,
          kiwiCredits: 0
        },
        groups: {
          hashValueOfFirstChart: {
            description: 'user-defined description',
            name: 'user-defined name',
            kiwiHashes: {
              0: 'hashValueOfFirstKiwi'
            }
          }
        },

        kiwis: {
          hashValueOfFirstKiwi: {
            updateFrequency: "a",
            url: "http://www.example.com/",
            path: "html>body>div>p:eq(0)",
            title: "Example Domain",
            values: {
              hashValueOfFirstValue: {
                date: "Sat May 31 2014 14:58:51 GMT-0700 (PDT)",
                value: "This domain is established to be used for illustrative examples in documents. You may use this↵    domain in examples without prior coordination or asking for permission."
              }
            }
          }
        }

      };
    db.update(obj);
  };

  db.child(uid).once('value', function(snapshot){
    var exists = (snapshot.val() !== null);
    if (!exists){
      writeUser();
    }
  });
}