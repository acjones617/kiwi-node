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
                element.droppable();
                element.disableSelection();
                element.on("dropdeactivate", function(event, ui) {
                    scope.$apply(function(){
                        // DragDropHandler.moveObject(scope.droppable, DragDropHandler.dragObject);
                        scope.ngUpdate({
                            kiwi: DragDropHandler.dragObject,
                        });
                    });
                    element.find('li.ui-draggable').remove();

                });
            }
        };
    }])

;})();