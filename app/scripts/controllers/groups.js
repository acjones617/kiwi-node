'use strict';

angular.module('KiwiApp')
  .controller('GroupCtrl', function ($scope, $http, $routeParams, $rootScope, Auth, $cookies) {
    
    $scope.groups = [];

    $scope.descriptionText; 
    $scope.kiwis = {};
    $scope.isLoading = true;
    $scope.groupData = [];
    var sessionRestored = false;

    var main = function() {
      if($cookies.kiwiUid){
        $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid);
        getKiwis();
        getGroups();
      }
    };

    var valuesToArray = function(obj) {
      return Object.keys(obj).map(function (key) { return obj[key]; });
    };

    var getGroups = function(){
      $scope._db.once('value', function(snapshot){
        var groups = snapshot.val().groups;
        _.each(groups, function(group, groupHash){
          var hashes = group.kiwiHashes;
          getKiwisFromHash(hashes, function(kiwis) {
            group.kiwiHashes = hashes;
            group.kiwis = kiwis;
            group.groupHash = groupHash;
            $scope.$apply(function() {
              $scope.groups.push(group);
            });
          });
        });
      });
    };

    var getKiwisFromHash = function(hashes, callback) {
      var result = [];
      if(hashes) {
        for(var i = 0; i < hashes.length; i++) {
          result.push($scope.kiwis[hashes[i]]);
        }
      }
      callback(result);
    };

    var getKiwis = function() {
      $scope._db.once('value', function(snapshot) {
        var kiwis = snapshot.val().kiwis;
        _.each(kiwis, function(kiwi, hash) {
          kiwi.values = washKiwi(kiwi);
          kiwi.hash = hash;
        });

        $scope.$apply(function() {
          $scope.kiwis = kiwis;
          $scope.isLoading = false;
        });
      });
    };

    var getKiwi = function(hash) {
      return $scope.kiwis[hash];
    }

    $scope.predicate = 'date';

    var formatDate = function(date) {
      return new Date(date[0], date[1]-1, date[2]).getTime();
    };


    var washKiwi = function(kiwi) {
      // Get the value part only
      // var plucked = _.pluck(kiwi.values, 'value');

      kiwi.values = valuesToArray(kiwi.values);
      var original = kiwi.values.shift();
      var parser = new NumberParser(original, kiwi.values);

      if(parser.isNumerical()) {
        return parser.parseAll();
      } else {
        // Do sentiment analysis
        // return parser.parseAll();
        return _.pluck(kiwi.values, 'value');
      }
    };

    $scope.selectKiwi = function(kiwi) {
      debugger;
      $scope.selectedKiwi = kiwi;
    };

    $scope.removeFromGroup = function(group, kiwi) {
      var index = group.kiwis.indexOf(kiwi);
      var hashIndex = group.kiwiHashes.indexOf(kiwi.hash);
      if(index > -1 && hashIndex > -1) {
        Array.prototype.splice.call(group.kiwis, index, 1);
        Array.prototype.splice.call(group.kiwiHashes, hashIndex, 1);
      }
    };

    $scope.save = function(group) {
      var selected = group;
      var groupLink = $scope._db.child('groups');

      var groupToSave = {};
      groupToSave.name = group.name;
      groupToSave.kiwiHashes = group.kiwiHashes || [];
      groupToSave.description = group.description || '';

      groupLink.child(group.name).set(groupToSave);
    };

    $scope.createGroup = function() {
      var group = {
        name: $scope.groupName,
        kiwis: [],
        kiwiHashes: []
      };
      $scope.groups.push(group);
      $('.input').val('');
    };

    $scope.addToGroup = function(kiwi) {
      $scope.selectedGroup.kiwis.push(kiwi);
      $scope.selectedGroup.kiwiHashes.push(kiwi.hash);
      $rootScope.$broadcast('updateCustom');
    };

    $scope.updateGroup = function(group, from, to, kiwi) {
      group.kiwiHashes.push(kiwi.hash);
      group.kiwis.push(kiwi);
    };

    main();

  });
