'use strict';

angular.module('KiwiApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
