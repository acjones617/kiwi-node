'use strict';

angular.module('KiwiApp')
  .service('Group', function Group($http, $rootScope, Auth, $cookies) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {


      getGroups: function(kiwis, callback){
        var that = this;
        this.getAll(kiwis, function(kiwis, groups) {
          var result = [];
          for(var groupHash in groups) {
            var group = groups[groupHash];

            var hashes = group.kiwiHashes;
            var kiwis = that.getKiwisFromHash(kiwis, hashes);
            group.kiwiHashes = hashes || [];
            group.kiwis = kiwis;
            group.isPublic = group.isPublic || false; //TODO: if undefined, only doing it for existing firbase data without this property
            group.groupHash = groupHash;

            result.push(group);

          }

          callback(result);
        });
      },
      getAll: function(kiwis, callback) {

        if($cookies.kiwiUid) {
          $http({
            method: 'GET',
            url: 'https://kiwidb.firebaseio.com/users/' + encodeURIComponent($cookies.kiwiUid) + '/groups.json?auth=' + $cookies.kiwiSpecial
          }).success(function(data, status, headers, config) {
            if(data !== 'null') {
              callback(kiwis, data);
            }
          }).error(function(data, status, headers, config) {
            console.error(data);
          });
        }

      },
      getKiwisFromHash: function(kiwis, hashes) {
        var result = [];
        if(Array.isArray(hashes)) {
          hashes.clean(undefined);
        } else {
          hashes = _.map(hashes, function(hash) {
            return hash;
          }).clean(undefined);
        }
        if(hashes) {
          for(var i = 0; i < hashes.length; i++) {
            result.push(kiwis[hashes[i]]);

          }
          return result;
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
