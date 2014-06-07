(function() {

    "use strict";

    angular.module('common.dragdrop', [])

    .factory('DragDropHandler', [function() {
        return {
            dragObject: undefined,
            addObject: function(object, objects, to) {
                objects.splice(to, 0, object);
            },
            moveObject: function(objects, from, to) {
                // objects.splice(to, 0, objects.splice(from, 1)[0]);
            }
        };
    }])

    .directive('draggable', ['DragDropHandler', function(DragDropHandler) {
        return {
            scope: {
                draggable: '='
            },
            link: function(scope, element, attrs){
                element.draggable({
                    connectToSortable: attrs.draggableTarget,
                    helper: "clone",
                    revert: "invalid",
                    start: function() {
                        DragDropHandler.dragObject = scope.draggable;
                    },
                    stop: function() {
                        DragDropHandler.dragObject = undefined;
                    }
                });

                element.disableSelection();
            }
        };
    }])

    .directive('droppable', ['DragDropHandler', function(DragDropHandler) {
        return {
            scope: {
                droppable: '=',
                ngUpdate: '&',
                ngCreate: '&'
            },
            link: function(scope, element, attrs){
                // debugger;
                element.droppable({
                    greedy: false
                });
                element.disableSelection();
                element.on("dropdeactivate", function(event, ui) {
                  var height = element.height();
                  var width = element.width();
                  var elementTop = element.offset().top;
                  var elementLeft = element.offset().left;
                  var itemTop = ui.offset.top;
                  var itemLeft = ui.offset.left;
                  if (itemTop > elementTop && itemTop < elementTop + height && itemLeft > elementLeft && itemLeft < elementLeft + width){
                    scope.$apply(function(){
                      scope.ngUpdate({
                          kiwi: DragDropHandler.dragObject,
                      });
                    });
                    element.find('li.ui-draggable').remove();
                  }

                });
            }
        };
    }])

;})();