// Refer to https://www.d3-graph-gallery.com/graph/parallel_custom.html

// set the dimensions and margins of the graph
var margin1 = {top: 25, right: 50, bottom: 10, left: 60},
  width1 = 300 - margin1.left - margin1.right,
  height1 = 185 - margin1.top - margin1.bottom;

// append the svg object to the body of the page
var svg_parallel = d3.select("#parallel")
.append("svg")
  .attr("width", width1 + margin1.left + margin1.right)
  .attr("height", height1 + margin1.top + margin1.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin1.left + "," + margin1.top + ")");

// Color scale: give me a specie name, I return a color
var color = d3.scaleOrdinal()
.domain(["setosa", "versicolor", "virginica" ])
.range([ "#440154ff", "#21908dff", "#fde725ff"])

var parseDate = d3.timeFormat("%Y-%m-%d");
var tip_parallel = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-5, 0])
  .html(function(d) {
    return 'Country: ' + d[0].Country + "<br>" + dimensions[0] + ': ' + d[0][dimensions[0]] + "<br>" + dimensions[1] + ': ' + d[0][dimensions[1]];
  })

svg_parallel.call(tip_parallel);

function update_parallel(allData, date, country_id){
  svg_parallel.selectAll('*').remove()

  var parallel_data = []
  date = new Date(date)
  day_minus = 7
  previous_date = new Date(date.getTime() - (day_minus * 24 * 60 * 60 * 1000))
  date = parseDate(date)
  previous_date = parseDate(previous_date)
  var max_cases = 0
  $.each(allData, function(k, v){
    var previous_cases = 0
    $.each(v.data, function(k1, v1){
      if(v1.date == previous_date){
        previous_cases = v1.total_cases
      }
      if(v1.date == date){
        if(k!='OWID_WRL' && v1.total_cases>max_cases)
          max_cases = v1.total_cases
        if(previous_cases==undefined)
          previous_cases = 0
        if(v1.total_cases==undefined)
          v1.total_cases = 0
        if(k!='OWID_WRL' && (previous_cases!=0 || v1.total_cases!=0)) //Eliminate world and previous & current cases 0
          parallel_data.push([{'Country_id' : k, 'Country': v.location, [previous_date] : previous_cases, [date] : v1.total_cases}])
      }
    })
  })
  
  // Here I set the list of dimension manually to control the order of axis:
  dimensions = [previous_date, date]
  // For each dimension, I build a linear scale. I store all in a y object
  var y1 = {}
  for (i in dimensions) {
  name = dimensions[i]
  y1[name] = d3.scaleLinear()
    .domain( [0,max_cases] ) // --> Same axis range for each group
    // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
    .range([height1, 0])
  }
  
  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
    return d3.line()(dimensions.map(function(p) { 
      return [x1(p), y1[p](d[0][p])]; 
    }));
  }

  // Build the X scale -> it find the best position for each Y axis
  x1 = d3.scalePoint()
  .range([0, width1])
  .domain(dimensions);

  // Draw the lines
  svg_parallel
    .selectAll("path")
    .data(parallel_data)
    .enter()
    .append("path")
      .attr("class", function (d) { 
        return "line " + d[0]
      } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
      .style("stroke", function(d){ 
        if(d[0].Country_id == country_id)
          return 'red'
        return 'black' 
      })
      .style("opacity", 1.0)
      .attr('stroke-width', function(d){ 
        if(d[0].Country_id == country_id)
          return 3.0
        return 1.5
      })
      .attr('stroke-opacity', function(d){ 
        if(country_id=='OWID_WRL' || d[0].Country_id == country_id)
          return 1.0
        return 0.1
      })
      .on('mouseover', tip_parallel.show)
      .on('mouseout', tip_parallel.hide)

  // Draw the axis:
  svg_parallel.selectAll("axis")
  // For each dimension of the dataset I add a 'g' element:
  .data(dimensions).enter()
  .append("g")
  .attr("class", "axis")
  // I translate this element to its right position on the x axis
  .attr("transform", function(d) { return "translate(" + x1(d) + ")"; })
  // And I build the axis with the call function
  .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y1[d])); })
  // Add axis title
  .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function(d) { return d; })
    .style("fill", "black")

}

