'use strict';

angular.module('kiwiNode2App')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams) {
    
    $scope.group = [];
    // $scope.graph = [{
    //     'key': 'test1',
    //     'values': [[3,5], [5,7], [7,9]]
    //   }, {
    //     'key': 'test2',
    //     'values': [[2,4], [3,5], [5,7]]
    //   }];
    $scope.graph = [];

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

    $scope.addToGroup = function(kiwi) {
      $scope.group.push(kiwi);
    };

    $scope.addToGraph = function(kiwi) {
      console.log(kiwi.graphData[0]);
      $scope.graph.push(kiwi.graphData[0]);
      $scope.$emit('updateCustom');
    };

    nv.addGraph(function() {
      var chart = nv.models.cumulativeLineChart()
        .x(function(d) { return d[0] })
        //adjusting, 100% is 1.00, not 100 as it is in the data
        .y(function(d) { return d[1] / 100 })
        .color(d3.scale.category10().range())
        .useInteractiveGuideline(true);

      chart.xAxis
        .tickFormat(function(d) {
          return d3.time.format('%x')(new Date(d))
        });

      chart.yAxis.tickFormat(d3.format(',.1%'));

      d3.select('#chart svg')
        .datum($scope.graph)
        .transition().duration(500)
        .call(chart);

      nv.utils.windowResize(chart.update);
      $scope.$on('updateCustom', function(event) {
        // debugger;
        chart.update();
      });

      return chart;
    });

    //TODO: revisit the url
    $http({
      method: 'GET',
      url: 'api/kiwis/' + $routeParams.email
    })
    .then(function(data) {

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
