'use strict';

angular.module('KiwiApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', 'Profile', function ($scope, $rootScope, Profile) {
    
    // var uId = $rootScope.auth.user.uid;
    // var firebaseAuthToken = $rootScope.auth.user.firebaseAuthToken;

    var main = function() {

      Profile.getSettings(function(settings) {
        var email = $rootScope.currentUser.thirdPartyUserData.email;
        $scope.settings = settings || {};
        $scope.settings.email = email;

      });

    };

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

    main();
  }]);
