'use strict';

angular.module('KiwiApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      slides.push({
        image: 'images/carousel-01.png'
      });
      slides.push({
        image: 'images/carousel-02.png'
      });
      slides.push({
        image: 'images/carousel-03.png'
      });
    };
    $scope.addSlide();
  }]);
