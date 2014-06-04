'use strict';

angular.module('KiwiApp')
.controller('PublicGroupCtrl', function ($scope, $http, $routeParams, $location) {
  $scope.isLoading = true;
  $scope.group = {};

  var valuesToArray = function(obj) {
    return Object.keys(obj).map(function (key) { return obj[key]; });
  };

  var washKiwi = function(kiwi) {
    // Get the value part only
    // var plucked = _.pluck(kiwi.values, 'value');

    kiwi.values = valuesToArray(kiwi.values);
    var original = kiwi.values.shift();
    var parser = new NumberParser(original, kiwi.values);

    if(parser.isNumerical()) {
      return parser.parseAll();
    } else {
      // Do sentiment analysis
      // return parser.parseAll();
      return _.pluck(kiwi.values, 'value');
    }
  };

  $http({
    method: 'GET',
    url: '/api/groups/' + $routeParams.fbId + '/' + $routeParams.groupRef,
  })
    .success(function(group){
      _.each(group.kiwis, function(kiwi) {
        // var temp = kiwi.values;
        kiwi.values = washKiwi(kiwi);
        kiwi.values = _.map(kiwi.values, function(val, key) {
          return {date: val.date, value: val.value};
        });
      });
      $scope.group = group;
      $scope.isLoading = false;
      console.log($scope.group);
    })
    .error(function() {
      $location.path( '/');
    });

});
