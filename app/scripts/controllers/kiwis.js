'use strict';

angular.module('KiwiApp')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams, $rootScope, Auth, $cookies) {
    
    $scope.chartToSave = [];
    $scope.groups = [];
    $scope.graph = [];
    $scope.selectedGroup = [];
    $scope.showDiscription = false;
    $scope.descriptionText; 
    $scope.kiwis = {};
    $scope.isLoading = true;
    $scope.chartData = [];
    var sessionRestored = false;
    // $scope.groups.push({done:false})
    $scope.$on('sessionRestored', function() {
      $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/facebook:10152208636623635');
      getCharts();
      getKiwis();
    });

    var valuesToArray = function(obj) {
      return Object.keys(obj).map(function (key) { return obj[key]; });
    }

    var getCharts = function(){
      $scope._db.once('value', function(snapshot){
        var charts = snapshot.val().charts;
        for (var chart in charts){
          var kiwis = charts[chart].kiwis;
          _.each(kiwis, function(kiwi) {
            kiwi.values = valuesToArray(kiwi.values);
          });
        }
          $scope.groups.push(snapshot.val().charts[chart]);
      });
      console.log($scope.groups)
    }
    

    var getKiwis = function() {

      $scope._db.once('value', function(snapshot) {
        var kiwis = snapshot.val().kiwis;
        _.each(kiwis, function(kiwi) {
          kiwi.values = valuesToArray(kiwi.values);
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
      var chartLink = new Firebase('https://kiwidb.firebaseio.com/users/facebook:10152208636623635/charts');
      var graphObj = {}, arr = [];
      graphObj.name = $scope.selectedGroup.name;
      console.log(selectedGroup)
      graphObj.kiwis = $scope.selectedGroup.kiwis;
      graphObj.description = $scope.descriptionText;

      $('.description').val('').blur();

      chartLink.push(graphObj);
      //sendto FB
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
      console.log(kiwi)
      $scope.selectedGroup.kiwis.push(kiwi);
      $rootScope.$broadcast('updateCustom');

    };

    if($cookies.kiwiUid){
      $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid);
      getCharts();
      getKiwis();
    }

  });
