'use strict';

angular.module('KiwiApp')
.controller('GraphCtrl', function ($scope, $http, $routeParams, $rootScope, $cookies) {

  $scope.$on('sessionRestored', function() {
    $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/' + $rootScope.currentUser.uid);
    getChart();
  });

  var getChart = function() {
    var user = 'facebook:' + $routeParams.user;
    var db = new Firebase('https://kiwidb.firebaseio.com/users/'+user+ '/groups')
      .once('value', function(data) {
        var charts = data.val();
        _.each(charts, function(chart) {
          if(chart.name === $routeParams.name) {
            $scope.$apply(function() {
              $scope.chart = chart;
            });
          }
        });
      });
  };
 
  if($cookies.kiwiUid){
    $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid);
    getChart();
  }

});
