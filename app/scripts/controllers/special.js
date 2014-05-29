'use strict';

angular.module('kiwiNode2App')
  .controller('SpecialCtrl', function ($scope, $cookies, $firebase, $firebaseSimpleLogin) {
    
    var ref = new Firebase('https://kiwidb.firebaseio.com/');



    $scope.doStuff = function() {
      var auth = new FirebaseSimpleLogin(ref, function(err, user) {
        if (err) {
          console.log('Error:, ', err);
        } else {
          if (user) {
            // note: not using angular cookies as they are not working
            // $cookies.kiwiSpecial = user.firebaseAuthToken;
            // $cookies.kiwiUid = user.uid;
            // TODO: fix this
            document.cookie = 'kiwiSpecial='+user.firebaseAuthToken+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
            document.cookie = 'kiwiUid='+user.uid+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
            open(location, '_self').close(); // TODO:
          }
        }
      });
      auth.login('facebook');
    };
  
  });
