'use strict';

angular.module('kiwiNode2App')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams) {
    //TODO: revisit the url
    $http({
      method: 'GET',
      url: 'api/kiwis/andrewk0291@gmail.com'
    })
    .then(function(data) {
      $scope.kiwis = data.data;
    })
    .catch(function() {
      $scope.errors.other = 'Error with retrieving kiwis.';
    });
  });
