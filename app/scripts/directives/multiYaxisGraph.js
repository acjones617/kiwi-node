'use strict';

angular.module('KiwiApp')
  .directive('multiYaxisGraph', function(){
    return {
      template: '<div class="multi-graph"></div>',
      restrict: 'E',
      scope: {
        group: '='
      },
      link: function(scope, element, attrs) {
        
        var ranges = [
          {divider: 1e18 , suffix: 'P'},
          {divider: 1e15 , suffix: 'E'},
          {divider: 1e12 , suffix: 'T'},
          {divider: 1e9 , suffix: 'G'},
          {divider: 1e6 , suffix: 'M'},
          {divider: 1e3 , suffix: 'k'}
        ];

        var formatNumber = function(n) {          
          if (n < 0) {
              // if negative run it as positive then prepend with '-'
              return '-' + formatNumber(-n);
          }
          for (var i = 0; i < ranges.length; i++) {
            if (n >= ranges[i].divider) {
              return (n / ranges[i].divider).toPrecision(3) + ranges[i].suffix;
            }
          }
          // if not within the ranges
          return n;
        };

        var getMax = function(tuples, index) {
          return d3.max(tuples, function(tuple) {
            return tuple[index];
          });
        };

        var getMin = function(tuples, index) {
          return d3.min(tuples, function(tuple) {
            return tuple[index];
          });
        };
        
        // create a line function that can convert data[] into x and y points
        var makeLine = function(xScaler, yScaler) {
          return d3.svg.line()
            .x(function(d, i) { 
              return xScaler(d[0]); 
            })
            .y(function(d, i) { 
              return yScaler(d[1]); 
            });      
        };

        // add the y-axes
        var addAnotherYAxis = function(index, yScaler, ticks, d3GraphObj, axisWidth) {
          var yAxisN = d3.svg.axis()
            .scale(yScaler)
            .ticks(ticks)
            .orient('left')
            .tickFormat(function(d) {
              return formatNumber(d);
            });
          var shiftLeft = index === 1 ? -0 : -axisWidth * (index-1);
          d3GraphObj.append('svg:g')
            .attr('class', 'y axis axis' + index)
            .attr('transform', 'translate(' + shiftLeft + ',0)')
            .call(yAxisN);
        };

        var makeMultiYAxisGraph = function(group) {
          _.each(group.kiwis, function(kiwi) {
            kiwi.values.sort(function(a, b) {
              return Date.parse(a.date) > Date.parse(b.date);
            });
          });

          // first pluck out the values property of each kiwi
          // the values property of each kiwi will be an array of 
          // objects like this {date: "Sat Feb 01 2014 00:00:00 GMT-0800 (PST)", value: 500}
          var kiwiValArrays = _.pluck(group.kiwis, 'values');
          var numYAxes = kiwiValArrays.length;

          // given the number formatting (i.e. 999 or 1.00k or 8.45M), this is how much
          // room to give each new y-axis (also given the fonts, etc.)
          var newYAxisWidth = 55;
          
          // define dimensions of graph
          var m = [10, 5, 20, numYAxes * newYAxisWidth - 10]; // top, right, bottom, left
          var w = 615 - m[1] - m[3];  // width - right - left
          var h = 300 - m[0] - m[2]; // height - top - bottom

          // number of ticks
          var xAxisTicks = 6;
          var yAxisTicks = 4;
           
          var yAxisBuffer = 0.05;

          // convert these into the desired format [1391241600000, 500]
          var datasets = _.map(kiwiValArrays, function(arr) {
            return _.map(arr, function(pair, index, arr) {
              return [Date.parse(pair.date), pair.value];
            });
          });

          var xMin = d3.min(datasets, function(set) {
            return d3.min(set, function(tuple) {
              return tuple[0];
            });
          });
          
          var xMax = d3.max(datasets, function(set) {
            return d3.max(set, function(tuple) {
              return tuple[0];
            });
          });

          // don't start and stop exactly at min and max
          var xAxisBuffer = 0.05 * (xMax - xMin);
          // x will scale all values within pixels 0-w
          var x = d3.time.scale()
            .domain([xMin - xAxisBuffer, xMax + xAxisBuffer])
            .range([0, w]);

          // add an SVG element with the desired dimensions and margin
          var div = element.find('div');
          div.empty();
          var svgWidth = w + m[1] + m[3];
          var svgHeight = h + m[0] + m[2];
          var graph = d3.select(div[0]).append('svg:svg')
            // .attr('width', svgWidth)
            // .attr('height', svgHeight)
            .attr('viewBox', '0 0 '+ svgWidth + ' ' + svgHeight)
            .attr('perserveAspectRatio', 'xMinYMin meet') // for resizing
            .append('svg:g')
            .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');


          // create x-axis
          var xAxis = d3.svg.axis().scale(x).ticks(xAxisTicks);
          // add the x-axis.
          graph.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);

          var lines = [];
          var yScalers = [];
          
          for (var i = 0; i < datasets.length; i++) {
            var dataMax = getMax(datasets[i], 1);
            var dataMin = Math.min(getMin(datasets[i], 1), 0); // user negative lower bound if exists
            var y = d3.scale.linear().domain([dataMin, dataMax * (1 + yAxisBuffer)]).range([h, 0]);
            yScalers.push(y); // needed below for plotting points
            lines.push(makeLine(x, y));
            addAnotherYAxis(i + 1, y, yAxisTicks, graph, newYAxisWidth);
          }

          // add lines and do so AFTER the axes above so that the lines are 
          // above the tick-lines
          for (var j = 0; j < datasets.length; j++) {
            graph.append('svg:path')
              .attr('d', lines[j](datasets[j]))
              .attr('class', 'data' + (j+1));
            for (var k = 0; k < datasets[j].length; k++) {
              graph.append('svg:circle')
                .attr('cx', x(datasets[j][k][0]))
                .attr('cy', yScalers[j](datasets[j][k][1]))
                .attr('class', 'data' + (j+1) + '-point')
                .attr('r', 2);
            }
          }

        };

        window.onresize = function() {
          var width = $('.group').width();
          element.find('svg').attr('width', width);
        };
        
        scope.$watch('group', function(newVal, oldVale) {
          makeMultiYAxisGraph(scope.group);
        });

        scope.$on('updateCustom', function(event) {
          makeMultiYAxisGraph(scope.group);
        });
      }
    };
  });