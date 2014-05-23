'use strict';

angular.module('kiwiNode2App')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams) {
    //TODO: revisit the url
    $http({
      method: 'GET',
      url: 'api/kiwis/' + $routeParams.email
    })
    .then(function(data) {
      data = data.data;
      for (var i = 0; i < data.length; i++) {
        data[i].graphData = {
          key: 'series' + i,
          values: [] 
        };
        for (var j in data[i].values) {
          data[i].graphData.values.push([j, data[i].values[j]]);
        }
      }
      $scope.kiwis = data;
    })
    .catch(function() {
      $scope.errors.other = 'Error with retrieving kiwis.';
    });
  });
