angular.module('KiwiApp')
  .directive('customMap', function(){
    return {
      template: '<svg></svg>',
      restrict: 'EA',
      link: function(scope, element, attrs, crtl) {
        nv.addGraph(function() {
          var chart = nv.models.cumulativeLineChart()
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

          debugger;

          d3.select(element.find('svg'))
            .datum(scope.$parent.groups[0].kiwis)
            .transition().duration(500)
            .call(chart);

          // chart();

          nv.utils.windowResize(chart.update);
          scope.$on('updateCustom', function(event) {
            chart.update();
          });

          return chart;
        }); 
      }
    };
  });