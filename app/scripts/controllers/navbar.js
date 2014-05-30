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
      });
    };

    $scope.logout = function() {
      // $rootScope.auth.$logout();
      Auth.logout();
    };
    
    $scope.getCreds = function(){
      $scope.prms = $scope.authRegister();
      $scope.prms.then(function(result){

        $http({
          method: 'POST',
          url: '/api/createUser',
          data: result
        }).success(function(){
          console.log('sent to server');
        });

      });
    };

    $scope.authRegister = function(){
      var deferred = $q.defer();
      deferred.resolve( $rootScope.auth.$login('facebook') );
      return deferred.promise;
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
