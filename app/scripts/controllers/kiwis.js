'use strict';

angular.module('KiwiApp')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams, $rootScope, Auth, $cookies, alerter) {
    
    $scope.groupToSave = [];
    $scope.groups = [];
    $scope.graph = [];
    $scope.selectedGroup = [];
    $scope.showDiscription = false;
    $scope.descriptionText; 
    $scope.kiwis = {};
    $scope.isLoading = true;
    $scope.groupData = [];
    $scope.kiwiName = true;
    var sessionRestored = false;

    var main = function() {
      if($cookies.kiwiUid){
        $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid);
        getKiwis();
      }
    };

    var valuesToArray = function(obj) {
      return Object.keys(obj).map(function (key) { return obj[key]; });
    };

    $scope.looseFocus = function() {
      $scope.kiwiName = true;
    }

    $scope.editKiwi = function(kiwi) {
      kiwi.edit = true;
      $scope.kiwiName = false;
      var thatScope = $scope;
      console.log($scope.kiwiName, "2x")
      var prevTitle = kiwi.title;
        $scope.editKiwi1 = function($scope) {
          if(!this.text) {
            kiwi.title = "Your kiwi must be at least one character long."
            return;
          }
          kiwi.title = this.text;
          var that = this;
          var newFBConnection = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid);
          // var newFBConnection = $scope._db.child('kiwis').child('title')
          newFBConnection.once('value', function(snapshot){
          _.each(snapshot.val().kiwis, function(value, key, obj) {
            if(value.title === prevTitle) {
              var newFBConnection1 = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid + '/kiwis/' + key);
              newFBConnection1.once('value', function(snapshot) {
                newFBConnection1.update({title: that.text});
              });
            }
          });
        });
        thatScope.kiwiName = true; 
        kiwi.edit = false;
      };
    };

    $scope.delete = function(kiwi) {
      $scope._db.child('kiwis').child(kiwi.hash).remove(function() {
        $scope.$apply(function() {
          delete $scope.kiwis[kiwi.hash];
          alerter.alert('Your kiwi has been deleted :(');
        });
      });
      $scope._db.child('groups').once('value', function(snapshot) {
        var groups = snapshot.val();
        _.each(groups, function(group, hash) {
          if(_.contains(group.kiwiHashes, kiwi.hash)) {
            $scope._db.child('groups').child(hash).child('kiwiHashes').child(group.kiwiHashes.indexOf(kiwi.hash)).remove();
          }
        });
      });
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
    };

    main();
  });
