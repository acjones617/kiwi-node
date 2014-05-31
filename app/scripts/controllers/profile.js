'use strict';

angular.module('KiwiApp')
  .controller('ProfileCtrl', function ($scope, $rootScope) {
    
    var uId = $rootScope.auth.user.uid;
    var firebaseAuthToken = $rootScope.auth.user.firebaseAuthToken;

    var db = new Firebase('https://kiwidb.firebaseio.com/users/' + uId + '/settings');
    db.auth(firebaseAuthToken);
    db.once('value', function(settings) {
      $scope.settings = settings.val() || {};
    });

    $scope.msg = '';

    $scope.update = function() {
      if($scope.profileForm.$valid) {
        db.set($scope.settings, function(err) {
          if(err) {
            $scope.msg = 'Error saving data.';
          } else {
            // TODO: this is not working as it should
            console.log('obvous');
            $scope.msg = 'Your changes have been saved.';
          }
        });
      } 
    };
  });
