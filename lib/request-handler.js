var Firebase = require('firebase');
var db = new Firebase('https://kiwidb.firebaseio.com/');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.getKiwis = function(req, res) {
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
      debugger;
    });
    res.send(result);
  });
};
