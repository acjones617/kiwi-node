'use strict';

angular.module('KiwiApp')
  .service('Kiwi', function Kiwi($http, $rootScope, Auth, $cookies, NumberParser) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {

      valuesToArray: function(obj) {
        if(obj !== undefined) {
          return Object.keys(obj).map(function (key) { return obj[key]; });
        }
      },

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

      washKiwi: function(kiwi) {
        // Get the value part only
        // var plucked = _.pluck(kiwi.values, 'value');
        kiwi.values = this.valuesToArray(kiwi.values);
        var original = kiwi.values.shift();
        var parser = new NumberParser(original, kiwi.values);

        if(parser.isNumerical()) {
          return parser.parseAll();
        } else {
          // Do sentiment analysis
          // return parser.parseAll();
          return _.pluck(kiwi.values, 'value');
        }
      },

      getKiwis: function(callback) {
        var that = this;
        this.getAll(function(kiwis) {
          _.each(kiwis, function(kiwi, hash) {
            kiwi.values = that.washKiwi(kiwi);
            kiwi.hash = hash;
          });

          callback(kiwis);
        });
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
