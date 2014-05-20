

angular.module('kiwi', [])
.controller('KiwiCtrl', function($scope, kiwiService) {
  var init = function() {
    kiwiService.getKiwis($scope.email).then(function(result, status, headers, config, statusText) {
      // debugger;
      $scope.kiwis = result.data;
    });
  };

  $scope.email = 'dokko1230@gmail.com';

  init();
})
.service('kiwiService', function($http) {
  this.getKiwis = function($email) {
    return $http({ method: 'GET', url: '/kiwis/' + $email });
  };
});
