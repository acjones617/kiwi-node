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
        var addAnotherYAxis = function(index, yScaler, ticks, d3GraphObj) {
          var yAxisN = d3.svg.axis().scale(yScaler).ticks(ticks).orient('left');
          var shiftLeft = index === 1 ? -15 : -50 * index + 25;
          d3GraphObj.append('svg:g')
            .attr('class', 'y axis axis' + index)
            .attr('transform', 'translate(' + shiftLeft + ',0)')
            .call(yAxisN);
        };

        var makeMultiYAxisGraph = function(group) {
          // first pluck out the values property of each kiwi
          // the values property of each kiwi will be an array of 
          // objects like this {date: "Sat Feb 01 2014 00:00:00 GMT-0800 (PST)", value: 500}
          debugger;
          var kiwiValArrays = _.pluck(group.kiwis, 'values');
          
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

          // define dimensions of graph
          var m = [40, 40, 40, 200]; // margins
          var w = 800 - m[1] - m[3];  // width - right - left
          var h = 300 - m[0] - m[2]; // height - top - bottom

          // x will scale all values within pixels 0-w
          var x = d3.time.scale()
            .domain([xMin, xMax])
            .range([0, w]);

          // add an SVG element with the desired dimensions and margin
          var div = element.find('div');
          div.empty();
          var graph = d3.select(div[0]).append('svg:svg')
            .attr('width', w + m[1] + m[3])
            .attr('height', h + m[0] + m[2])
            .append('svg:g')
            .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

          // create x-axis
          var xAxis = d3.svg.axis().scale(x).tickSize(-h);
          // add the x-axis.
          graph.append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + h + ')')
            .call(xAxis);

          var lines = [];
          
          for (var i = 0; i < datasets.length; i++) {
            var dataMax = getMax(datasets[i], 1);
            var dataMin = Math.min(getMin(datasets[i], 1), 0); // user negative lower bound if exists
            var y = d3.scale.linear().domain([dataMin, dataMax]).range([h, 0]);
            lines.push(makeLine(x, y));
            addAnotherYAxis(i + 1, y, 4, graph);
          }

          // add lines and do so AFTER the axes above so that the lines are 
          // above the tick-lines
          for (var j = 0; j < datasets.length; j++) {
            graph.append('svg:path').attr('d', lines[j](datasets[j])).attr('class', 'data' + (j+1));
          }
        };
        
        makeMultiYAxisGraph(scope.group);

        scope.$on('updateMultiYaxisGraph', function(event) {
          makeMultiYAxisGraph(scope.group);
        });
      }
    };
  });