'use strict';

angular.module('kiwiNode2App')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams) {
    
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

    //TODO: revisit the url
    $http({
      method: 'GET',
      url: 'api/kiwis/' + $routeParams.email
    })
    .then(function(data) {

      var angularData = jQuery.extend({}, data.data);

      data = data.data;
        var secondData;
        var arr = [];
        $scope.dragItem = function(is) {
          for(var i = 0; i < data.length; i++) {
              var title = data[i].title = data[i].title.split(' ')[0] 
              if(is.target.innerText === title) {
                secondData = data[i];
                arr.push(secondData)
                $scope.kiwis = arr;
             }
          }
        } 
        // console.log(secondData)
    
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

        // Clean up the values
        var parser = new ValueParser(original, plucked);
        var parsedValues = parser.parseAll();
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
