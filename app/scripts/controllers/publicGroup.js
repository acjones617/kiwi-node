'use strict';

angular.module('KiwiApp')
.controller('PublicGroupCtrl', function ($scope, $http, $routeParams, $rootScope, $cookies) {
  $http({
    method: 'GET',
    url: '/api/groups/' + $routeParams.fbId + '/' + $routeParams.groupName,
  }).success(function(result){
    $scope.data = result;
    console.log(result);
  });

});
