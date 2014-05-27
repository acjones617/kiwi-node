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

    $scope.exampleData = [{
      'key': 'Test 1',
      'values': [ 
        [ 1025409600000, 0] ,
        [ 1028088000000, -6.3382185140371],
        [ 1030766400000, -5.9507873460847],
        [ 1033358400000, -11.569146943813],
        [ 1036040400000, -5.4767332317425],
        [ 1038632400000, 0.50794682203014],
        [ 1041310800000, -5.5310285460542],
        [ 1043989200000, -5.7838296963382],
        [ 1046408400000, -7.3249341615649],
        [ 1049086800000, -6.7078630712489],
        [ 1051675200000, 0.44227126150934],
        [ 1054353600000, 7.2481659343222]]
    }, ];

    //TODO: revisit the url
    $http({
      method: 'GET',
      url: 'api/kiwis/' + $routeParams.email
    })
    .then(function(data) {

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
        _.each(data[i].values, function(item, key) {
          // TODO: need to change if stored dateformat changes
          // or if crawled more than once a day
          var dateParts = item.date.split('-');
          var x = new Date(dateParts[0], dateParts[1]-1, dateParts[2]).getTime();
          var y = item.value.replace(/[^\d.-]/g, '');

          data[i].graphData[0].values.push([x, y]);

        });
        console.log(data)
        
      $scope.kiwis = data;
    }
    })
    .catch(function() {
      $scope.errors.other = 'Error with retrieving kiwis.';
    });
  });
