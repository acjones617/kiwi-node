'use strict';

angular.module('KiwiApp')
  .factory('Auth', function Auth($location, $rootScope, $firebase, $firebaseSimpleLogin, $cookies, flash) {

    return {
      /**
       * Login the user
       * 
       * @param  {Function} callback - optional
       */
      login: function(callback) {
        var cb = callback || angular.noop;
        var ref = new Firebase('https://kiwidb.firebaseio.com/');
        // $rootScope.auth = $firebaseSimpleLogin(ref);
        // $rootScope.auth.$login('facebook');
        var auth = new FirebaseSimpleLogin(ref, function(err, user) {
          if (err) {
            console.log('Error with login. Error:, ', err);
          } else {
            if (user) {
              $rootScope.currentUser = user;
              $cookies.kiwiSpecial = user.firebaseAuthToken;
              $cookies.kiwiUid = user.uid;
              flash('Logged in!');
              callback(user);
            }
          }
        });
        // auth.login('facebook');
        auth.login('facebook', {
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
        // debugger;
        $rootScope.auth.logout();
        $cookies.kiwiSpecial = null;
        $cookies.kiwiUid = null;
        flash('You have successfully logged out!');
        $location.path('/');
      },

      /**
       * Simple check to see if a user is logged in
       * 
       * @return {Boolean}
       */
      isLoggedIn: function() {
        var user = $rootScope.currentUser;
        return !!user || $cookies.kiwiUid !== 'null';
      },
    };
  });