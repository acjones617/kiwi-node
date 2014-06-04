'use strict';

angular.module('KiwiApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, Auth, $q, $http) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];
    
    $scope.login = function() {
      Auth.login(function(user) {
        $rootScope.currentUser = user;
        $scope.getCreds(user);
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
  });
