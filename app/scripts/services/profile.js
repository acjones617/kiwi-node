'use strict';

angular.module('KiwiApp')
  .service('Profile', function Profile($http, $cookies, $rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      getSettings: function(callback) {

        if($cookies.kiwiUid) {
          $http({
            method: 'GET',
            url: 'https://kiwidb.firebaseio.com/users/' + encodeURIComponent($cookies.kiwiUid) + '/settings.json?auth=' + $cookies.kiwiSpecial
          }).success(function(data, status, headers, config) {
            if(data !== 'null') {
              callback(data);
            }
          }).error(function(data, status, headers, config) {
            console.error(data);
          });
        }
 
      }
    };
  });
