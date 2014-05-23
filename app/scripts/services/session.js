'use strict';

angular.module('kiwiNode2App')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
