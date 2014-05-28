'use strict';

angular.module('kiwiNode2App')
  .controller('NavbarCtrl', function ($scope, $location, $firebase, $firebaseSimpleLogin) {
    
    var ref = new Firebase('https://kiwidb.firebaseio.com/');
    $scope.auth = $firebaseSimpleLogin(ref);
    
    ref.child('users/').on('value', function(snapshot) {
      console.log(snapshot);
    });

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
