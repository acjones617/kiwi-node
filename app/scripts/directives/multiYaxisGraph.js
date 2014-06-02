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
        
        // self invoking function to help make a legend
        //https://gist.github.com/ZJONSSON/3918369
        (function() {
          d3.legend = function(g) {
            g.each(function() {
              var g= d3.select(this),
                  items = {},
                  svg = d3.select(g.property('nearestViewportElement')),
                  legendPadding = g.attr('data-style-padding') || 5,
                  lb = g.selectAll('.legend-box').data([true]),
                  li = g.selectAll('.legend-items').data([true]);

              lb.enter().append('rect').classed('legend-box',true);
              li.enter().append('g').classed('legend-items',true);

              svg.selectAll('[data-legend]').each(function() {
                  var self = d3.select(this);
                  items[self.attr('data-legend')] = {
                    pos : self.attr('data-legend-pos') || this.getBBox().y,
                    color : self.attr('data-legend-color') != undefined ? self.attr('data-legend-color') : self.style('fill') != 'none' ? self.style('fill') : self.style('stroke') 
                  };
                });

              items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos});

              
              li.selectAll('text')
                  .data(items,function(d) { return d.key})
                  .call(function(d) { d.enter().append('text')})
                  .call(function(d) { d.exit().remove()})
                  .attr('y',function(d,i) { return i+'em'})
                  .attr('x','1em')
                  .text(function(d) { ;return d.key})
              
              li.selectAll('circle')
                  .data(items,function(d) { return d.key})
                  .call(function(d) { d.enter().append('circle')})
                  .call(function(d) { d.exit().remove()})
                  .attr('cy',function(d,i) { return i-0.25+'em'})
                  .attr('cx',0)
                  .attr('r','0.4em')
                  .style('fill',function(d) { console.log(d.value.color);return d.value.color}); 
              
              // Reposition and resize the box
              var lbbox = li[0][0].getBBox();
              lb.attr('x',(lbbox.x-legendPadding))
                  .attr('y',(lbbox.y-legendPadding))
                  .attr('height',(lbbox.height+2*legendPadding))
                  .attr('width',(lbbox.width+2*legendPadding));
            });
            return g;
          };
          })();

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
          var m = [40, 40, 100, 200]; // margins
          var w = 800 - m[1] - m[3];  // width - right - left
          var h = 400 - m[0] - m[2]; // height - top - bottom

          // x will scale all values within pixels 0-w
          var x = d3.time.scale()
            .domain([xMin, xMax])
            .range([0, w]);

          // add an SVG element with the desired dimensions and margin
          var div = element.find('div');
          div.empty();
          var svgWidth = w + m[1] + m[3];
          var svgHeight = h + m[0] + m[2];
          var graph = d3.select(div[0]).append('svg:svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .attr('viewBox', '0 0 '+ svgWidth + ' ' + svgHeight)
            .attr('perserveAspectRatio', 'xMinYMid') // for resizing
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
            graph.append('svg:path')
            .attr('d', lines[j](datasets[j]))
            .attr('class', 'data' + (j+1))
            .attr('data-legend', group.kiwis[j].title);
          }

        var legend = graph.append('g')
          .attr('class','legend')
          .attr('transform','translate(0, ' + (h + 40) + ')')
          .style('font-size','12px')
          .attr('data-style-padding',5)
          .call(d3.legend);

        };
        
        makeMultiYAxisGraph(scope.group);

        scope.$on('updateCustom', function(event) {
          makeMultiYAxisGraph(scope.group);
        });
      }
    };
  });