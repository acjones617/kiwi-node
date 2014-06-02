'use strict';

angular.module('KiwiApp')
  .controller('GroupsTestingCtrl', function ($scope) {
    
    $scope.test = function() {
      // var lastTime = $scope.groups[0].kiwis[0].values[-1][0];
      $scope.groups[0].kiwis[0].values.push({date: 'Tue Feb 11 2014 00:00:00 GMT-0800 (PST)', value: 0});
      $scope.$broadcast('updateCustom');
      // alert('hi');
    };

    $scope.groups = [
      {
        groupTitle: 'My Awesome Group',
        kiwis: [
          {
            title: 'IMDB - Predator',
            values:[{date:'Sat Feb 01 2014 00:00:00 GMT-0800 (PST)', value: 7},
                    {date:'Sun Feb 02 2014 00:00:00 GMT-0800 (PST)', value: 0},
                    {date:'Mon Feb 03 2014 00:00:00 GMT-0800 (PST)', value: 1.5},
                    {date:'Tue Feb 04 2014 00:00:00 GMT-0800 (PST)', value: 5},
                    {date:'Wed Feb 05 2014 00:00:00 GMT-0800 (PST)', value: 4},
                    {date:'Thu Feb 06 2014 00:00:00 GMT-0800 (PST)', value: 9},
                    {date:'Fri Feb 07 2014 00:00:00 GMT-0800 (PST)', value: 6},
                    {date:'Sat Feb 08 2014 00:00:00 GMT-0800 (PST)', value: 6},
                    {date:'Sun Feb 09 2014 00:00:00 GMT-0800 (PST)', value: 8.1},
                    {date:'Mon Feb 10 2014 00:00:00 GMT-0800 (PST)', value: 2}]
          },
          {
            title: 'IMDB - Total Recall',
            values:[{date:'Sun Feb 02 2014 00:00:00 GMT-0800 (PST)', value: 1000},
                    {date:'Tue Feb 04 2014 00:00:00 GMT-0800 (PST)', value: 2000},
                    {date:'Thu Feb 06 2014 00:00:00 GMT-0800 (PST)', value: 5000},
                    {date:'Sat Feb 08 2014 00:00:00 GMT-0800 (PST)', value: 5000},
                    {date:'Mon Feb 10 2014 00:00:00 GMT-0800 (PST)', value: 4000},
                    {date:'Wed Feb 12 2014 00:00:00 GMT-0800 (PST)', value: 999},
                    {date:'Fri Feb 14 2014 00:00:00 GMT-0800 (PST)', value: 3000},
                    {date:'Sun Feb 16 2014 00:00:00 GMT-0800 (PST)', value: 6700},
                    {date:'Tue Feb 18 2014 00:00:00 GMT-0800 (PST)', value: 800},
                    {date:'Thu Feb 20 2014 00:00:00 GMT-0800 (PST)', value: 0}]
          }]
      }
    ];
  });