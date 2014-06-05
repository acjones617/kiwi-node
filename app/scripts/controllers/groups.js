'use strict';

angular.module('KiwiApp')
  .controller('GroupCtrl', function ($scope, $rootScope, alerter, Group, Kiwi) {
    

    var main = function() {
      $scope.isLoading = true;
      $scope.predicate = 'date';
      Kiwi.getKiwis(function(kiwis) {
        $scope.kiwis = kiwis;
        Group.getGroups($scope.kiwis, function(groups) {
          $scope.groups = groups;
        });
      });
      $scope.isLoading = false;
    };

    $scope.editing = function(group) {
      group.editing = true;
    };

    $scope.changeFocus = function(group) {
      group.editing = false;
    };

    $scope.removeFromGroup = function(group, kiwi) {
      var index = group.kiwis.indexOf(kiwi);
      var hashIndex = group.kiwiHashes.indexOf(kiwi.hash);
      if(index > -1 && hashIndex > -1) {
        Array.prototype.splice.call(group.kiwis, index, 1);
        Array.prototype.splice.call(group.kiwiHashes, hashIndex, 1);
        $rootScope.$broadcast('updateCustom');
      }
    };

    $scope.save = function(group) {
      // var groupLink = $scope._db.child('groups');

      var groupToSave = {};
      groupToSave.name = group.name;
      groupToSave.kiwiHashes = group.kiwiHashes || [];
      groupToSave.description = group.description || '';
      groupToSave.isPublic = group.isPublic;

      // groupLink.child(group.name).set(groupToSave);
      Group.save(groupToSave, group.groupHash, function() {
        alerter.alert('Your graph has been saved! :)');
      });
    };

    $scope.createGroup = function() {
      var group = {
        name: $scope.groupName,
        isPublic: false,
        kiwis: [],
        kiwiHashes: []
      };
      $scope.groups.push(group);
      $('.input').val('');
    };

    $scope.updateGroup = function(group, from, to, kiwi) {
      if(!_.contains(group.kiwiHashes, kiwi.hash)) {
        group.kiwiHashes.push(kiwi.hash);
        group.kiwis.push(kiwi);
        $rootScope.$broadcast('updateCustom');
      }
    };

    Array.prototype.clean = function(deleteValue) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {         
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    };

    main();

  });
