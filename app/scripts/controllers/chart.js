'use strict';

angular.module('KiwiApp')
.controller('ChartCtrl', function ($scope, $http, $routeParams, $rootScope) {

  debugger;
  var ref = new Firebase('https://kiwidb.firebaseio.com/');
  $rootScope.auth = $firebaseSimpleLogin(ref);
  
  var db = new Firebase('https://kiwidb.firebaseio.com/users/' + $rootScope.auth.user.uid + '/charts')
                .startAt($routeParams.name)
                .endAt($routeParams.name)
                .once('value', function(chart) {
                  debugger;
                });

});
