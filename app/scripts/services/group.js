'use strict';

angular.module('KiwiApp')
  .service('Group', function Group($http, $rootScope, Auth, $cookies) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      getAll: function(callback) {

        if($cookies.kiwiUid) {
          $http({
            method: 'GET',
            url: 'https://kiwidb.firebaseio.com/users/' + encodeURIComponent($cookies.kiwiUid) + '/groups.json?auth=' + $cookies.kiwiSpecial
          }).success(function(data, status, headers, config) {
            if(data !== 'null') {
              callback(data);
            }
          }).error(function(data, status, headers, config) {
            console.error(data);
          });
        }

      },
      save: function(group, hash, callback) {
        if($cookies.kiwiUid) {
          $http({
            method: 'PUT',
            data: group,
            url: 'https://kiwidb.firebaseio.com/users/' + encodeURIComponent($cookies.kiwiUid) + '/groups/' + encodeURIComponent(hash) + '.json?auth=' + $cookies.kiwiSpecial
          }).success(function(data, status, headers, config) {
            callback();
          }).error(function(data, status, headers, config) {
            console.error(data);
          });
        }  
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
