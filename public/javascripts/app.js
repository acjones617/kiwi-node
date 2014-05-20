// alert('testing')

angular.module('kiwi', ['ngRoute'])
.controller('mainController', function($scope) {
  $scope.kiwis = ['yo', 'whut', 'something'];
});
