'use strict';

angular.module('KiwiApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'common.dragdrop',
  'common.confirm',
  'firebase'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/kiwis', {
        templateUrl: 'partials/kiwis',
        controller: 'KiwisCtrl',
        authenticate: true
      })
      .when('/profile', {
        templateUrl: 'partials/profile',
        controller: 'ProfileCtrl',
        authenticate: true
      })
      .when('/groups', {
        templateUrl: 'partials/groups',
        controller: 'GroupCtrl',
        authenticate: true
      })
      .when('/groups/:fbId/:groupRef', {
        templateUrl: 'partials/public_group',
        controller: 'PublicGroupCtrl'
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
  .run(function ($rootScope, $location, Auth, $cookies) {
    // needed to check cookie to see if user already logged in
    $rootScope.Firebase = Firebase;

    var ref = new $rootScope.Firebase('https://kiwidb.firebaseio.com/');
    $rootScope.auth = new FirebaseSimpleLogin(ref, function(err, user) {
      if (err) {
        console.log('Error with login. Error:, ', err);
      } else {
        if (user) {
          $rootScope.$apply(function() {

            $rootScope.currentUser = user;
            $cookies.kiwiSpecial = user.firebaseAuthToken;
            $cookies.kiwiUid = user.uid;
            $rootScope.Firebase.goOffline();
          });
          // callback(user);
        }
      }
    });

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/');
      }
    });
  });

function CarouselCtrl($scope) {
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
}
