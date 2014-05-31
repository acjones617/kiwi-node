angular.module('KiwiApp')
  .directive('customMap', function(){
    return {
      template: '<svg style="height: 400px;"></svg>',
      restrict: 'EAC',
      scope: {
        group: '=',
        kiwi: '='
      },
      link: function(scope, element, attrs) {
        var svg = dimple.newSvg(element.find('svg')[0], 590, 400);
        var data;
        if(scope.group) {
          data = scope.group;
        } else {
          data = scope.kiwi.graphData[0].values;
        }
        var myChart = new dimple.chart(svg, data);
        myChart.setBounds(60, 30, 505, 305);
        var x = myChart.addCategoryAxis("x", "x");
        x.addOrderRule("Date");
        m
        var s = myChart.addSeries("Channel", dimple.plot.area);
        s.interpolation = "cardinal";
        myChart.draw();
        scope.$on('updateCustom', function(event) {
          myChart.draw();
        });
      }
    };
  });