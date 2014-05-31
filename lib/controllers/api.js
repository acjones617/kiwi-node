'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Firebase = require('firebase');


/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
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
          email: false
        },
        premiumSettings: {
          premium: false,
          kiwiCredits: 0
        },

        kiwis: {
          hashValueOfFirstKiwi: {
            updateFrequency: "a",
            url: "http://www.example.com/",
            path: "html>body>div>p:eq(0)",
            title: "Example Domain",
            values: {
              hashValueOfFirstValue: {
                date: "2014-4-31",
                value: "This domain is established to be used for illustrative examples in documents. You may use this↵    domain in examples without prior coordination or asking for permission."
              }
            }
          }
        }

      };
    db.update(obj);
  }

  db.child(uid).once('value', function(snapshot){
    var exists = (snapshot.val() !== null);
    if (!exists){
      writeUser();
    }
  });
}


