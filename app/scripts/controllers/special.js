'use strict';

angular.module('KiwiApp')
  .controller('SpecialCtrl', function ($scope, $http, $cookies, $firebase, $firebaseSimpleLogin) {
    
    var ref = new Firebase('https://kiwidb.firebaseio.com/');

  $scope.doStuff = function() {
    var auth = new FirebaseSimpleLogin(ref, function(err, user) {
       if (err) {
         console.log('Error:, ', err);
       } else {
         if (user) {
           if(user.uid) {
             document.cookie = 'kiwiSpecial='+user.firebaseAuthToken+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
             document.cookie = 'kiwiUid='+user.uid+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
             $scope.message = 'You have been successfully logged in!';
             
              $http({
                method: 'POST',
                url: '/api/createUser',
                data: user
              }).success(function(){
                console.log('sent to server');
              });
             
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
    // Firebase.goOffline();
    };
  
  });
