'use strict';

angular.module('KiwiApp')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams, $rootScope, Auth, $cookies) {
    
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
    }
  
    var valuesToArray = function(obj) {
      return Object.keys(obj).map(function (key) { return obj[key]; });
    }

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
          newFBConnection.once('value', function(snapshot){
          _.each(snapshot.val().kiwis, function(value, key, obj) {
            if(value.title === prevTitle) {
              var newFBConnection1 = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid + '/kiwis/' + key);
              newFBConnection1.once('value', function(snapshot) {
               newFBConnection1.update({title: that.text})
              })
            }
          })
        })
        thatScope.kiwiName = true; 
        kiwi.edit = false;
      }
    }

    var getKiwis = function() {

      $scope._db.once('value', function(snapshot) {
        var kiwis = snapshot.val().kiwis;

        // RAMIN: GRAPH STUFF GOES HERE

        // _.each(data, function(kiwi, key, kiwis) {
        //   // debugger;
        //   var title = kiwi.title = kiwi.title.split(' ')[0];
        //   kiwi.graphData = [{
        //     key: title,
        //     values: [] 
        //   }];

        //   var parsedValues = washKiwi(kiwi);
        //   pushKiwiToGraph(kiwi, parsedValues);
        // });
        
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

    main();
  });
