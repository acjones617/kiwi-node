'use strict';

angular.module('KiwiApp')
  .service('Kiwi', function Kiwi($http, $rootScope, Auth, $cookies) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      editTitle: function(kiwi, callback) {

        if($cookies.kiwiUid) {
          $http({
            method: 'PUT',
            url: 'https://kiwidb.firebaseio.com/users/' + encodeURIComponent($cookies.kiwiUid) + '/kiwis/' + encodeURIComponent(kiwi.hash) + '/title.json?auth=' + $cookies.kiwiSpecial,
            data: JSON.stringify(kiwi.title)
          }).success(function(data, status, headers, config) {
            callback(data);
          }).error(function(data, status, headers, config) {
            console.error(data);
          });
        }
      },

      getAll: function(callback) {
        if($cookies.kiwiUid) {
          $http({
            method: 'GET',
            url: 'https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid + '/kiwis.json?auth=' + $cookies.kiwiSpecial
          }).success(function(data, status, headers, config) {
            if(data !== 'null') {
              callback(data);
            }
          }).error(function(data, status, headers, config) {
            console.error(data);
          });
        }

      },
      deleteKiwi: function(kiwi, callback) {
        if($cookies.kiwiUid) {
          $http({
            method: 'DELETE',
            url: 'https://kiwidb.firebaseio.com/users/' + encodeURIComponent($cookies.kiwiUid) + '/kiwis/' + encodeURIComponent(kiwi.hash) + '.json?auth=' + $cookies.kiwiSpecial
          }).success(function(data, status, headers, config) {
            callback(data);
          }).error(function(data, status, headers, config) {
            console.error(data);
          });
        }

      }
    };
  });
