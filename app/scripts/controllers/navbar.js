'use strict';

angular.module('KiwiApp')
  .controller('NavbarCtrl', function ($scope, $location, $firebase, $firebaseSimpleLogin, $q) {
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
    
    $scope.getCreds = function(){
      $scope.prms = $scope.authRegister();
      $scope.prms.then(function(result){
        console.log(result);
      })
    }

    $scope.authRegister = function(){
      var deferred = $q.defer();
      deferred.resolve( $scope.auth.$login('facebook') );
      return deferred.promise;
    }

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });

