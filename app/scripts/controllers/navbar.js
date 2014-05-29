'use strict';

angular.module('KiwiApp')
  .controller('NavbarCtrl', function ($scope, $location, $firebase, $firebaseSimpleLogin) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };
    
    var ref = new Firebase('https://kiwidb.firebaseio.com/');
    $scope.auth = $firebaseSimpleLogin(ref);
     
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
