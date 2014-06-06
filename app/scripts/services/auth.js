'use strict';

angular.module('KiwiApp')
  .factory('Auth', ['$location', '$rootScope', '$firebase', '$cookies', 'alerter', function Auth($location, $rootScope, $firebase, $cookies, alerter) {

    return {
      /**
       * Login the user
       * 
       * @param  {Function} callback - optional
       */
      login: function(callback) {
        var cb = callback || angular.noop;

        $rootScope.auth.login('facebook', {
          rememberMe: true,
          scope: 'email'
        });
      },

      /**
       * Logout the user
       * 
       * @param  {Function} callback - optional
       */
      logout: function() {
        $rootScope.currentUser  = null;
        $rootScope.auth.logout();
        $cookies.kiwiSpecial = null;
        $cookies.kiwiUid = null;
        $location.path('/');
        alerter.alert('You have been logged out. Goodbye for now!');
      },

      /**
       * Simple check to see if a user is logged in
       * 
       * @return {Boolean}
       */
      isLoggedIn: function() {
        var user = $rootScope.currentUser;
        return !!user || $cookies.kiwiSpecial;
      },
    };
  }]);