'use strict';

angular.module('KiwiApp')
.controller('PublicGroupCtrl', function ($scope, $http, $routeParams) {
  $http({
    method: 'GET',
    url: '/api/groups/' + $routeParams.fbId + '/' + $routeParams.groupRef,
  }).success(function(group){
    // console.log(group);
    _.each(group.kiwis, function(kiwi) {
      // var temp = kiwi.values;
      kiwi.values = _.map(kiwi.values, function(value, key) {
        return [{date: value.date, vale: value.value}];
      });
    });
    $scope.group = group;
  });

});
