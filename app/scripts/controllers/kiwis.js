'use strict';

angular.module('KiwiApp')
  .controller('KiwisCtrl', ['$scope', '$rootScope', 'alerter', 'Kiwi', 'Group', function ($scope, $rootScope, alerter,  Kiwi, Group) {

    var main = function() {
      $scope.isLoading = true;
      $scope.predicate = 'date';
      Kiwi.getKiwis(function(kiwis) {
        _.each(kiwis, function(kiwi) {
          _.each(kiwi.values, function(item) {
            item.date = Date.parse(item.date);
          });
        });
        $scope.kiwis = kiwis;
        $scope.isLoading = false;
      });
    };

    $scope.editing = function(kiwi) {
      kiwi.editing = true;
    };

    $scope.edit = function(kiwi) {
      Kiwi.editTitle(kiwi, function() {
        kiwi.editing = false;
        alerter.alert('Your kiwi has been saved! :)');
      });
    };

    $scope.changeFocus = function(kiwi) {
      kiwi.editing = false;
    };

    $scope.delete = function(kiwi) {

      Kiwi.deleteKiwi(kiwi, function() {
        delete $scope.kiwis[kiwi.hash];

        Group.getAll(function(groups) {
          _.each(groups, function(group, hash) {
            if(_.contains(group.kiwiHashes, kiwi.hash)) {
              Group.deleteHashFromGroup(group, kiwi.hash, function() {
                alerter.alert('Your kiwi has been deleted :(');
              });
            }
          });
        });

      });
    };
    main();
  }]);
