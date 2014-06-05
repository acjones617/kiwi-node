'use strict';

angular.module('KiwiApp')
  .factory('Auth', function Auth($location, $rootScope, $firebase, $cookies, alerter) {

    return {
      /**
       * Login the user
       * 
       * @param  {Function} callback - optional
       */
      login: function(callback) {
        var cb = callback || angular.noop;
        var ref = new $rootScope.Firebase('https://kiwidb.firebaseio.com/');
        $rootScope.auth = new FirebaseSimpleLogin(ref, function(err, user) {
          if (err) {
            console.log('Error with login. Error:, ', err);
          } else {
            if (user) {
              $rootScope.currentUser = user;
              $cookies.kiwiSpecial = user.firebaseAuthToken;
              $cookies.kiwiUid = user.uid;
              callback(user);
            }
          }
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
        return !!user;
      },
    };
  });