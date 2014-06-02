'use strict';

angular.module('KiwiApp')
  .directive('alerter', function(){
    return {
      restrict: 'EAC',
      scope: {
        group: '=',
        kiwi: '='
      },
      link: function(scope, element, attrs) {
        $('.__kiwiSuccess').remove();
        $("body").prepend("<div class='__kiwiSuccess'\n     style='background-color: #FAFF9A;\n            position: fixed;\n            z-index: 9000;\n            color: black;\n            font-family: Helvetica;\n            height: 40px;\n            font-size: 14px;\n            width: 96%;\n            padding: 10px 10px;\n            margin: 10px 12px;'>\n            " + message + "</div>");
        $(".__kiwiSuccess").delay(configs.displayDelay).fadeTo(5000, 0, function() {
          return $(this).remove();
        });
      }
    };
  });