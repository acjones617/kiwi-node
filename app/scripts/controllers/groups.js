'use strict';

angular.module('KiwiApp')
  .controller('GroupCtrl', function ($scope, $http, $routeParams, $rootScope, Auth, $cookies) {
    
    $scope.groups = [];

    $scope.descriptionText; 
    $scope.kiwis = {};
    $scope.isLoading = true;
    $scope.groupData = [];
    $scope.showDescription = true;
    $scope.showDescriptionTitle = true;
    $scope.changeNameShow = true;
    var sessionRestored = false;

    Array.prototype.clean = function(deleteValue) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {         
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    };

    var main = function() {
      if($cookies.kiwiUid){
        $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid);
        getKiwis();
        getGroups();
      }
    };

    var valuesToArray = function(obj) {
      return Object.keys(obj).map(function (key) { return obj[key]; });
    };

    var getGroups = function(){
      $scope._db.once('value', function(snapshot){
        var groups = snapshot.val().groups;
        _.each(groups, function(group, groupHash){
          var hashes = group.kiwiHashes;
          getKiwisFromHash(hashes, function(kiwis) {
            group.kiwiHashes = hashes || [];
            group.kiwis = kiwis;
            group.groupHash = groupHash;
            $scope.$apply(function() {
              $scope.groups.push(group);
              $scope.isLoading = false;
            });
          });
        });
      });
    };

    var getKiwisFromHash = function(hashes, callback) {
      var result = [];
      hashes.clean(undefined);
      if(hashes) {
        for(var i = 0; i < hashes.length; i++) {
          result.push($scope.kiwis[hashes[i]]);
        }
      }
      callback(result);
    };

    var getKiwis = function() {
      $scope._db.once('value', function(snapshot) {
        var kiwis = snapshot.val().kiwis;
        _.each(kiwis, function(kiwi, hash) {
          kiwi.values = washKiwi(kiwi);
          kiwi.hash = hash;
        });

        $scope.$apply(function() {
          $scope.kiwis = kiwis;
          $scope.isLoading = false;
        });
      });
    };

    var getKiwi = function(hash) {
      return $scope.kiwis[hash];
    }

    $scope.predicate = 'date';

    var formatDate = function(date) {
      return new Date(date[0], date[1]-1, date[2]).getTime();
    };


    var washKiwi = function(kiwi) {
      // Get the value part only
      // var plucked = _.pluck(kiwi.values, 'value');

      kiwi.values = valuesToArray(kiwi.values);
      var original = kiwi.values.shift();
      var parser = new NumberParser(original, kiwi.values);

      if(parser.isNumerical()) {
        return parser.parseAll();
      } else {
        // Do sentiment analysis
        // return parser.parseAll();
        return _.pluck(kiwi.values, 'value');
      }
    };

    $scope.selectKiwi = function(kiwi) {
      $scope.selectedKiwi = kiwi;
    };

    $scope.looseFocus = function() {
      $scope.showDescription = true;
    }

    $scope.removeFromGroup = function(group, kiwi) {
      var index = group.kiwis.indexOf(kiwi);
      var hashIndex = group.kiwiHashes.indexOf(kiwi.hash);
      if(index > -1 && hashIndex > -1) {
        Array.prototype.splice.call(group.kiwis, index, 1);
        Array.prototype.splice.call(group.kiwiHashes, hashIndex, 1);
        $rootScope.$broadcast('updateCustom');
      }
    };

    // //save new group name
    // $scope.changeGroupName = function(group) {

    //   $scope._db.once('value', function(snapshot){

    //   })
    //   $scope.changeNameShow = false;
      
    // }
    $scope.changeGroupName = function(group, changedGroupName) {
      var nameToUpdate = changedGroupName;
      var originalName = group.name;
      var toUpdateKey = $scope._db + '/groups/'

      $scope._db.once('value', function(snapshot) {
        _.each(snapshot.val().groups, function(value, key, obj){
          if(key === originalName) {
            //revisit
            // console.log(toUpdateKey)
            //update key in snapshot.val().groups

            //update value.name in snapshot.val().groups
          }
        })
        
      })

      $scope.changeFocus();
    }

    $scope.changeFocus = function() {
      $scope.changeNameShow = !$scope.changeNameShow;
    }
    $scope.changeFocusBlur = function() {
      $scope.changeNameShow = true;
    }

  //   $scope.testSave = function(group) {
  //     $scope.showDescription = false;
  //     var orginalName = group.name;
  //     $scope.updateName = function(group) {
  //       var newName = group.name;
  //       var groupLink = $scope._db.child('groups');
  //       groupLink.once('value', function(snapshot){
  //         _.each(snapshot.val(), function(value, key, obj){
  //           if(key === orginalName) {
  //             var temp = obj[key].name
  //             groupLink.update({temp: newName})
  //             //console.log(obj[key].name)
  //           }
  //         })
  //       })
        
  //       $scope.showDescription = true;
  //   }
  // }
  //   $scope.testSave = function(group) {
  //     $scope.showDescription = false;
  //     var selected = group;
  //     var groupLink = $scope._db.child('groups');

  //     var groupToSave = {};
  //     groupToSave.name = group.name;
  //     groupToSave.kiwiHashes = group.kiwiHashes;
  //     groupToSave.description = group.description;

  //     groupLink.child(group.name).update(groupToSave.name);
  //     console.log(groupLink.child(group.name))
  //     // $scope.showDescription = true;  
  //     //$scope.showDescription = true;
  // }

    $scope.save = function(group) {
      var selected = group;
      var groupLink = $scope._db.child('groups');

      var groupToSave = {};
      groupToSave.name = group.name;
      groupToSave.kiwiHashes = group.kiwiHashes || [];
      groupToSave.description = group.description || '';

      groupLink.child(group.name).set(groupToSave);
      $scope.showDescription = true;
    };

    $scope.createGroup = function() {
      var group = {
        name: $scope.groupName,
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

    main();

  });
