'use strict';

var Firebase = require('firebase');

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
  db.auth('4sMMNGVsvzGbQgTcuTnpOmD7ZUb3JSFsjelHrhaj', function(){});
  db.update(obj);

  db.child(uid).once('value', function(snapshot){
    var exists = (snapshot.val() !== null);
    if (!exists){
      writeUser();
    }
  });
}


