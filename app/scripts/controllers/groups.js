'use strict';

angular.module('KiwiApp')
  .controller('GroupCtrl', function ($scope, $http, $routeParams, $rootScope, Auth, $cookies) {
    
    $scope.groupToSave = [];
    $scope.groups = [];
    $scope.graph = [];
    $scope.selectedGroup = [];
    $scope.showDiscription = false;
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
        _.each(groups, function(group){
          // debugger;
          var hashes = group.kiwis;
          // _.each(kiwis, function(kiwi) {
          //   kiwi.values = valuesToArray(kiwi.values);
          // });
          getKiwisFromHash(hashes, function(kiwis) {
            group.kiwis = kiwis;
            $scope.$apply(function() {
              debugger;
              $scope.groups.push(group);
            });
          });
        });
      });
    };

    var getKiwisFromHash = function(hashes, callback) {
      var result = [];
      $scope._db.once('value', function(snapshot) {
        var kiwis = snapshot.val().kiwis;
        _.each(kiwis, function(kiwi, hash) {
          if(_.contains(hashes, hash)) {
            result.push(kiwi);
          }
        });
        callback(result);
      });
    };

    var getKiwis = function() {
      $scope._db.once('value', function(snapshot) {
        var kiwis = snapshot.val().kiwis;
        _.each(kiwis, function(kiwi, hash) {
          kiwi.values = valuesToArray(kiwi.values);
          kiwi.hash = hash;
        });

        $scope.$apply(function() {
          $scope.kiwis = kiwis;
          $scope.isLoading = false;
        });
      });
    };


    $scope.predicate = 'date';

    var formatDate = function(date) {
      return new Date(date[0], date[1]-1, date[2]).getTime();
    };

    var washKiwi = function(kiwi) {
      // Get the value part only
      var plucked = _.pluck(kiwi.values, 'value');
      var original = plucked.shift();
      var parser = new NumberParser(original, plucked);

      if(parser.isNumerical()) {
        return parser.parseAll();
      } else {
        // Do sentiment analysis
        // return parser.parseAll();
        return _.pluck(kiwi.values, 'value');
      }
    };

    var pushKiwiToGraph = function(kiwi, parsedValues) {
      var count = 0;
      _.each(kiwi.values, function(item, key) {
        item.value = parsedValues[count++];
        if(item.value) {
          var x = formatDate(item.date.split('-'));
          var y = item.value;
          kiwi.graphData[0].values.push({
            x: x, 
            y: y
          });
        }
        formatDate(item);
      });
    }

    $scope.hoverGroupName = function(group) {
      $scope.description = group.description;
      console.log($scope.description)
    };

    $scope.hoverLeaveGroupName = function() {
      $scope.description ='';
    }

    $scope.saveGraph = function() {
      $scope.showDescription = true;
    }
      //' + $rootScope.auth.user.uid +'
    $scope.saveGraphToDatabase = function() {
      var selected = $scope.selectedGroup;
      var groupLink = $scope._db.child('groups');

      var graphObj = {}, arr = [];
      graphObj.name = $scope.selectedGroup.name;

      var kiwiHashes = [];
      _.each($scope.selectedGroup.kiwis, function(kiwi) {
        kiwiHashes.push(kiwi.hash);
      });
      graphObj.kiwis = kiwiHashes;
      graphObj.description = $scope.descriptionText;

      $('.description').val('').blur();

      groupLink.push(graphObj);
    }    

    $scope.selectGroup = function(group) {
      $scope.selectedGroup.done = false;
      $scope.selectedGroup = group;
      $scope.selectedGroup.done = true;
    };

    $scope.createGroup = function() {
      var group = {
        name: $scope.groupName,
        kiwis: []
      };
      $scope.groups.push(group);
      $('.input').val('');
    };

    $scope.addToGroup = function(kiwi) {
      $scope.selectedGroup.kiwis.push(kiwi);
      $rootScope.$broadcast('updateCustom');

    };

    main();

  });
