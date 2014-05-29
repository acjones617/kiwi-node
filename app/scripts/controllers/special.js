'use strict';

angular.module('KiwiApp')
  .controller('SpecialCtrl', function ($scope, $cookies, $firebase, $firebaseSimpleLogin) {
    
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
             setTimeout(function(){
              open(location, '_self').close(); // TODO:Do this in a non-hacky manner.
             }, 5000); 
           }
         }
       }
     });
       auth.login('facebook');
    };



    // $scope.auth = $firebaseSimpleLogin(ref);

    // $scope.doStuff = function() {

    //   $scope.auth.$login('facebook');
    //   $scope.$watch('auth.firebaseAuthToken', function(newValue) {
    //     debugger;
    //     $cookies.kiwiSpecial = newValue.firebaseAuthToken;
    //     $cookies.kiwiUid = newValue.user.uid;
    //     //close the window
    //   });
    // };

  });
