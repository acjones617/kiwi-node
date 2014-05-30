'use strict';

angular.module('KiwiApp')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams, $rootScope) {
    
    $scope.groups = [];
    $scope.graph = [];
    $scope.selectedGroup = [];
    var db = new Firebase('https://kiwidb.firebaseio.com/users/' + $rootScope.auth.user.uid);
    var result = [];

    var getKiwis = function() {
      db.once('value', function(snapshot) {
        var data = snapshot.val().kiwis;
        _.each(data, function(kiwi, key, kiwis) {
          var title = kiwi.title = kiwi.title.split(' ')[0];
          kiwi.graphData = [{
            key: title,
            values: [] 
          }];

          var parsedValues = washKiwi(kiwi);
          pushKiwiToGraph(kiwi, parsedValues);
        });
        $scope.kiwis = data;
      });
    };

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
          // debugger;
          kiwi.graphData[0].values.push({
            x: x, 
            y: y
          });
        }
        formatDate(item);
      });
    }

    $scope.xAxisTickFormatFunc = function(d) {
      return function(d){
        return d3.time.format('%m-%d')(new Date(d));
      };
    };

    $scope.yAxisTickFormatFunc = function(){
      return function(d){
          return d3.format(',f')(d);
      };
    };

    $scope.selectGroup = function(group) {
      $scope.selectedGroup = group;
      $('.groupName').toggleClass("Name");
    };

    $scope.createGroup = function() {
      var group = {
        name: $scope.groupName,
        kiwis: []
      };
      $scope.groups.push(group);
      $('.input').val('');
    };

   // var dupsArr = [];
    $scope.addToGroup = function(kiwi) {
      
      //if(dupsArr.indexOf(kiwi.title) === -1) {
        $scope.selectedGroup.kiwis.push(kiwi.graphData[0]);
        $rootScope.$broadcast('updateCustom');
      
     // dupsArr.push(kiwi.title) 
    };
    // $scope.removeFromGroup = function(kiwi) {
    //   for(var i = 0; i < $scope.selectedGroup.kiwis.length; i++) {
    //     console.log($scope.selectedGroup.kiwis[i].key)
    //   }
      
     // $scope.selectedGroup.kiwis.push(kiwi.graphData[0]);
    //   $rootScope.$broadcast('updateCustom');
    // }
    getKiwis();

  });
