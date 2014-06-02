'use strict';

angular.module('KiwiApp')
  .controller('ProfileCtrl', function ($scope, $rootScope, Auth, $cookies) {
    
    // var uId = $rootScope.auth.user.uid;
    // var firebaseAuthToken = $rootScope.auth.user.firebaseAuthToken;

    if($cookies.kiwiUid){
      $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid + '/settings');
      $scope._db.once('value', function(settings) {
        debugger;
        var email = $rootScope.currentUser.thirdPartyUserData.email;
        $scope.$apply(function() {
          $scope.settings = settings.val() || {};
          $scope.settings.email = email;
        });
      });
    }

    $scope.msg = '';

    $scope.update = function() {
      var amp = $scope.settings.email.match(/\@/);
      var dot = $scope.settings.email.match(/\./);
      var dotLastIndex = $scope.settings.email.lastIndexOf('.');

      if(!dot || dotLastIndex < amp.index) {
         $scope.msg = 'Please enter a valid email.'
         return;
      }
      if($scope.profileForm.$valid) {
        $scope._db.set($scope.settings, function(err) {

          if(err) {
            $scope.$apply(function() {
              $scope.msg = 'Error saving data.';
            });
          } else {
            $scope.$apply(function() {
              $scope.msg = 'Your changes have been saved.';
            });
          }
        });
      } 
    };
  });
