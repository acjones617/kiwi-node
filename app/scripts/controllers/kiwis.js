'use strict';

angular.module('KiwiApp')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams, $rootScope) {
    
    $scope.groups = [];
    $scope.graph = [];
    $scope.selectedGroup = [];
    var db = new Firebase('https://kiwidb.firebaseio.com/users/facebook:10152208636623635');
    var result = [];

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
    db.once('value', function(snapshot) {
      // snapshot.forEach(function(item) {
      //   // var kiwi = item.val();
      //   result.push(item);
      // });
      // console.log(result);
    });

    // $scope.removeFromGroup = function(kiwi) {
    //   for(var i = 0; i < $scope.selectedGroup.kiwis.length; i++) {
    //     console.log($scope.selectedGroup.kiwis[i].key)
    //   }
      
     // $scope.selectedGroup.kiwis.push(kiwi.graphData[0]);
    //   $rootScope.$broadcast('updateCustom');
    // }


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
