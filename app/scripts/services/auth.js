'use strict';

angular.module('KiwiApp')
  .factory('Auth', function Auth($location, $rootScope, $firebase, $firebaseSimpleLogin, $cookies) {

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
              $cookies.kiwiSpecial = user.firebaseAuthToken;
              $cookies.kiwiUid = user.Uid;
              callback(user);
            }
          }
        });
        auth.login('facebook');
      },

      /**
       * Logout the user
       * 
       * @param  {Function} callback - optional
       */
      logout: function() {
        // firebase logout function handled directly in controller
        
        // handle other cleanup tasks
        $rootScope.currentUser  = null;
        $rootScope.auth.$logout();
        $cookies.kiwiSpecial = null;
        $cookies.kiwiUid = null;
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