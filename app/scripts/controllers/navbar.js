'use strict';

angular.module('KiwiApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $location, $firebase, $firebaseSimpleLogin, $q, Auth, $http) {
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
