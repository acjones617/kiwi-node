'use strict';

angular.module('KiwiApp')
  .service('Group', function Group($http, $rootScope, Auth, $cookies) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      edit: function() {

      },
      getAll: function(callback) {

        if($cookies.kiwiUid) {
          $http({
            method: 'GET',
            url: 'https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid + '/groups.json?auth=' + $cookies.kiwiSpecial
          }).success(function(data, status, headers, config) {
            callback(data);
          }).error(function(data, status, headers, config) {
            console.error(data);
          });
        }

      },
      save: function() {

      },
      deleteHashFromGroup: function(group, kiwiHash, callback) {
        if($cookies.kiwiUid) {
            $http({
              method: 'DELETE',
              url: 'https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid + '/groups/' + encodeURIComponent(group.name) + '/kiwiHashes/' + group.kiwiHashes.indexOf(kiwiHash) + '.json?auth=' + $cookies.kiwiSpecial
            }).success(function(data, status, headers, config) {
              callback(data);
            }).error(function(data, status, headers, config) {
              console.error(data);
            });
          }
        }

    };
  });
