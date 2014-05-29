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
           // note: not using angular cookies as they are not working
           // $cookies.kiwiSpecial = user.firebaseAuthToken;
           // $cookies.kiwiUid = user.uid;
           // TODO: fix this
           document.cookie = 'kiwiSpecial='+user.firebaseAuthToken+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
           document.cookie = 'kiwiUid='+user.uid+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
           $('body').append('<h1>You have been successfully logged in</h1>');
           setTimeout(function(){
            open(location, '_self').close(); // TODO:
           }, 5000); 
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
