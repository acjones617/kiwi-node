'use strict';

angular.module('KiwiApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'firebase'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/kiwis/', {
        templateUrl: 'partials/kiwis',
        controller: 'KiwisCtrl',
        authenticate: true
      })
      .when('/special', {
        templateUrl: 'partials/special',
        controller: 'SpecialCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, $firebase, $firebaseSimpleLogin) {
    // needed to check cookie to see if user already logged in
    var ref = new Firebase('https://kiwidb.firebaseio.com/');
    $rootScope.auth = $firebaseSimpleLogin(ref);

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      if (next.authenticate && (!$rootScope.auth || !$rootScope.auth.user)) {
        $location.path('/');
      }
    });
  });

function CarouselCtrl($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 1080 + slides.length;
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/400',
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide();
  }
}

var Utils = {};