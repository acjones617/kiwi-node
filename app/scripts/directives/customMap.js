angular.module('KiwiApp')
  .directive('customMap', function(){
    return {
      template: '<svg></svg>',
      restrict: 'EAC',
      scope: {
        group: '='
      },
      link: function(scope, element, attrs) {
        nv.addGraph(function() {
          var chart = nv.models.lineChart()
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1] })
            .color(d3.scale.category10().range())
            .useInteractiveGuideline(true);

          chart.xAxis
            .tickFormat(function(d) {
              return d3.time.format('%x')(new Date(d))
            });

          chart.yAxis
            .tickFormat(function(d){
              return d3.format(',f')(d);
            });

          

          d3.select(element.find('svg')[0])
            .datum(scope.group.kiwis)
            .transition().duration(500)
            .call(chart);
      
          nv.utils.windowResize(chart.update);
          scope.$on('updateCustom', function(event) {
            chart.update();
          });

          return chart;
        }); 
      }
    };
  });