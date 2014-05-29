'use strict';

angular.module('KiwiApp')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams, $rootScope) {
    

    $scope.groups = [];
    $scope.graph = [];
    $scope.selectedGroup = [];
    var db = new Firebase('https://kiwidb.firebaseio.com/users/facebook:10103897713367983');
    var result = [];

    db.once('value', function(snapshot) {
      console.log(snapshot.val());
      // snapshot.forEach(function(item) {
      //   // var kiwi = item.val();
      //   result.push(item);
      // });
      // console.log(result);
    });

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
    };

    $scope.createGroup = function() {
      var group = {
        name: $scope.groupName,
        kiwis: []
      };
      $scope.groups.push(group);
    };


    $scope.addToGroup = function(kiwi) {
      $scope.selectedGroup.kiwis.push(kiwi.graphData[0]);
      $rootScope.$broadcast('updateCustom');
    };


    //TODO: revisit the url
    $http({
      method: 'GET',
      url: 'api/kiwis/' + $routeParams.email
    })
    .then(function(data) {
    // TODO: revisit the url
      var angularData = jQuery.extend({}, data.data);
      data = data.data;
      // loop through because a user can have multiple items being tracked
      for (var i = 0; i < data.length; i++) {
        var title = data[i].title = data[i].title.split(' ')[0]  
        data[i].graphData = [{
          key: title, // TODO: will prob need to shorten if too long
          values: [] 
        }];
        // Get the value part only
        var plucked = _.pluck(data[i].values, 'value');
        var original = plucked.shift();
        var parser = new NumberParser(original, plucked);

        if(parser.isNumerical()) {
          // Use the parser and clean up the values
          var parsedValues = parser.parseAll();
        } else {
          // Do sentiment analysis
        }

        var count = 0;
        _.each(data[i].values, function(item, key) {
          item.value = parsedValues[count++];
          if(item.value) {
            var dateParts = item.date.split('-');
            var x = new Date(dateParts[0], dateParts[1]-1, dateParts[2]).getTime();
            var y = item.value.replace(/[^\d.-]/g, '');
            data[i].graphData[0].values.push([x, y]);
          }

        });

      }
      $scope.kiwis = angularData;
    })
    .catch(function() {
      $scope.errors.other = 'Error with retrieving kiwis.';
    });
  });
