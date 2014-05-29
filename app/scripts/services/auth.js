'use strict';

angular.module('KiwiApp')
  .factory('Auth', function Auth($location, $rootScope, $firebase, $firebaseSimpleLogin) {
    
   
    // TODO: 
    // Get currentUser from cookie
    // $rootScope.currentUser = $cookieStore.get('user') || null;
    // $cookieStore.remove('user');

    return {
      /**
       * Login the user
       * 
       * @param  {Function} callback - optional
       */
      login: function(callback) {
        var cb = callback || angular.noop;
        var ref = new Firebase('https://kiwidb.firebaseio.com/');
        var auth = new FirebaseSimpleLogin(ref, function(err, user) {
          if (err) {
            console.log('Error with login. Error:, ', err);
          } else {
            if (user) {
              $rootScope.currentUser = user;
              // TODO: fix these hardcoded expiration dates
              document.cookie = 'kiwiSpecial='+user.firebaseAuthToken+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
              document.cookie = 'kiwiUid='+user.uid+'; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/';
              cb(user);
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
        $location.path('/');
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