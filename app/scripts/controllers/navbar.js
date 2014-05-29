'use strict';

angular.module('KiwiApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, $firebase, $firebaseSimpleLogin) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];
    
    var ref = new Firebase('https://kiwidb.firebaseio.com/');
    $rootScope.auth = $firebaseSimpleLogin(ref);

    $scope.login = function() {
      $rootScope.auth.$login('facebook');
    };

    $scope.logout = function() {
      $rootScope.auth.$logout();
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });



// angular.module('KiwiApp')
//   .controller('NavbarCtrl', function ($scope, $location, $rootScope, $firebase, $firebaseSimpleLogin) {
//     $scope.menu = [{
//       'title': 'Home',
//       'link': '/'
//     }, {
//       'title': 'Settings',
//       'link': '/settings'
//     }];
    
//     var ref = new Firebase('https://kiwidb.firebaseio.com/');
//     var auth;

//     $scope.login = function(callback) {
//       var cb = callback || angular.noop;
//       auth = new FirebaseSimpleLogin(ref, function(err, user) {
//         if (err) {
//           console.log('Error with login. Error:, ', err);
//         } else {
//           if (user) {
//             $rootScope.currentUser = user;
//             // TODO: fix these hardcoded expiration dates
//             document.cookie = 'kiwiSpecial='+user.firebaseAuthToken+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
//             document.cookie = 'kiwiUid='+user.uid+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
//             cb(user);
//           }
//         }
//       });
    
//       auth.login('facebook');
//     };

//     $scope.logout = function() {
//       auth.logout();
//       $rootScope.currentUser  = null;
//       $location.path('/');
//     };

//     // var ref = new Firebase('https://kiwidb.firebaseio.com/');
//     // $scope.auth = $firebaseSimpleLogin(ref);
     
//     $scope.isActive = function(route) {
//       return route === $location.path();
//     };
//   });


