'use strict';

angular.module('KiwiApp')
  .controller('KiwisCtrl', function ($scope, $http, $routeParams, $rootScope, Auth, $cookies) {
    
    $scope.chartToSave = [];
    $scope.groups = [];
    $scope.graph = [];
    $scope.selectedGroup = [];
    $scope.showDiscription = false;
    $scope.descriptionText; 
    $scope.kiwis = {};
    $scope.isLoading = true;
    var sessionRestored = false;
    // $scope.groups.push({done:false})
    $scope.$on('sessionRestored', function() {
      $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/facebook:10103901484620363');
      getCharts();
      getKiwis();
    });

    var valuesToArray = function(obj) {
      return Object.keys(obj).map(function (key) { return obj[key]; });
    }

    var getCharts = function(){
      $scope._db.once('value', function(snapshot){
        for (var chart in snapshot.val().charts){
          $scope.groups.push(snapshot.val().charts[chart]);
        }
        console.log($scope.groups)
      });
    }

    var getKiwis = function() {

      $scope._db.once('value', function(snapshot) {
        var kiwis = snapshot.val().kiwis;
        _.each(kiwis, function(kiwi) {
          kiwi.values = valuesToArray(kiwi.values);
        });
        // _.each(data, function(kiwi, key, kiwis) {
        //   debugger;
        //   var title = kiwi.title = kiwi.title.split(' ')[0];
        //   kiwi.graphData = [{
        //     key: title,
        //     values: [] 
        //   }];

        //   var parsedValues = washKiwi(kiwi);
        //   pushKiwiToGraph(kiwi, parsedValues);
        // });
        $scope.$apply(function() {
          $scope.kiwis = kiwis;
          $scope.isLoading = false;
        });
      });
    };

    $scope.predicate = 'date';

    var formatDate = function(date) {
      return new Date(date[0], date[1]-1, date[2]).getTime();
    };

    var washKiwi = function(kiwi) {
      // Get the value part only
      var plucked = _.pluck(kiwi.values, 'value');
      var original = plucked.shift();
      var parser = new NumberParser(original, plucked);

      if(parser.isNumerical()) {
        return parser.parseAll();
      } else {
        // Do sentiment analysis
        // return parser.parseAll();
        return _.pluck(kiwi.values, 'value');
      }
    };

    var pushKiwiToGraph = function(kiwi, parsedValues) {
      var count = 0;
      _.each(kiwi.values, function(item, key) {
        item.value = parsedValues[count++];
        if(item.value) {
          var x = formatDate(item.date.split('-'));
          var y = item.value;
          kiwi.graphData[0].values.push({
            x: x, 
            y: y
          });
        }
        formatDate(item);
      });
    }

    $scope.xAxisTickFormatFunc = function(d) {
      return function(d){
        return d3.time.format('%m-%d')(new Date(d));
      };
    };

    $scope.yAxisTickFormatFunc = function(){
      return function(d){
          return d3.format(',f')(d);
      };
    };

   $scope.saveGraph = function() {
      $scope.showDescription = true;
    }
      //' + $rootScope.auth.user.uid +'
    $scope.saveGraphToDatabase = function() {
      var selected = $scope.selectedGroup;
      var chartLink = new Firebase('https://kiwidb.firebaseio.com/users/facebook:10152208636623635/charts');
      var graphObj = {}, arr = [];
      graphObj.name = $scope.selectedGroup.name;
      graphObj.kiwis = $scope.selectedGroup.kiwis;

      console.log($scope.selectedGroup.kiwis)

  // for(var i = 0; i < selected.kiwis.length; i++) {
  //       graphObj.kiwis = selected.kiwis[i].values; //this must be complete kiwis
  //     }    
      // graphObj.title = selected.kiwis[0].title;
      // graphObj.description = $scope.descriptionText;
      // graphObj.values = selected.kiwis[0].values;

      // console.log('selected.kiwis', selected.kiwis[0])
      // console.log('selected.kiwis.title', selected.kiwis[0].name)
      // console.log('selected.kiwis.values', selected.kiwis[0].values)
      // //graphObj.kiwis = 
           

      // for(var i = 0; i < $scope.groups.length; i++) {
      //   var kiwi = $scope.groups[i].kiwis;
      //   //for(var j = 0; j < kiwi.length; j++) {
      //     arr.push(kiwi.title);
      //  // }
      // }

      // graphObj.kiwis = arr;
      // console.log('selected: ', selected);
      // console.log(graphObj)

      chartLink.push(graphObj);
      //sendto FB
    }    

    $scope.selectGroup = function(group) {
      $scope.selectedGroup.done = false;
      $scope.selectedGroup = group;
      $scope.selectedGroup.done = true;
    };

    $scope.createGroup = function() {
      var group = {
        name: $scope.groupName,
        kiwis: []
      };
      $scope.groups.push(group);
      $('.input').val('');
    };

    $scope.addToGroup = function(kiwi) {
      $scope.selectedGroup.kiwis.push(kiwi);
      $rootScope.$broadcast('updateCustom');

    };

    if($cookies.kiwiUid){
      $scope._db = new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid);
      getCharts();
      getKiwis();
    }

  });
