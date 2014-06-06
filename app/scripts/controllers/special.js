'use strict';

angular.module('KiwiApp')
  .controller('SpecialCtrl', ['$scope', '$cookies', '$firebase', '$firebaseSimpleLogin', function ($scope, $cookies, $firebase, $firebaseSimpleLogin) {
    

  $scope.doStuff = function() {
    var ref = new Firebase('https://kiwidb.firebaseio.com/');
    var auth = new FirebaseSimpleLogin(ref, function(err, user) {
       if (err) {
         console.log('Error:, ', err);
       } else {
         if (user) {
           if(user.uid) {
              document.cookie = 'kiwiSpecial='+user.firebaseAuthToken+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
              document.cookie = 'kiwiUid='+user.uid+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
              $scope.message = 'You have been successfully logged in!';
              setTimeout(function(){
                open(location, '_self').close(); 
              }, 5000); 
           }
         }
       }
     });
    auth.login('facebook', {
      rememberMe: true
    });
    };
  
  }]);
