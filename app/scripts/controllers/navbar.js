'use strict';

angular.module('KiwiApp')
  .controller('NavbarCtrl', ['$scope', '$rootScope', '$location', 'Auth', '$q', '$http', '$firebase', function ($scope, $rootScope, $location, Auth, $q, $http, $firebase) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];
    
    $scope.login = function() {
      // Auth.login(function(user) {
      //   $rootScope.currentUser = user;
      //   $rootScope.Firebase.goOffline();
      // });
      Auth.login(function(user) {
        $rootScope.currentUser = user;
        $scope.getCreds(user);
        $cookies.kiwiSpecial = user.firebaseAuthToken;
        $cookies.kiwiUid = user.uid;
      });
    };

    $scope.logout = function() {
      // $rootScope.auth.$logout();
      Auth.logout();
    };
    
    $scope.getCreds = function(userData){
      $http({
        method: 'POST',
        url: '/api/createUser',
        data: userData
      }).success(function(){
        console.log('sent to server');
      });
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }]);
