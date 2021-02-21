// https://www.d3-graph-gallery.com/graph/choropleth_basic.html

var centered
width = 500
height = 290
var x, y, k;

var svg = d3.select("#map")
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('transform','translate(0,20)')
  .attr("class", "map_class")
  
svg.append("rect")
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'AliceBlue')
  .on("click", clicked);

function clicked(d){
  country_name.text('WorldWide')
  path.attr('fill', function (n) {
    return colorScale(n.total);
  })
  svg.select('g').transition()
    .duration(750)
    .attr("transform", "scale(" + 1 + ")")
  update2('OWID_WRL')
}

country_name = svg.append('text')
  .text('WorldWide')
  .attr('transform','translate(5,20)')
  .attr('fill', 'blue')
  .attr('font-size',18)
  
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-5, 0])
  .html(function(d) {
    if (d.id) {
        return 'Country: ' + d.properties.name + "<br>Total Cases: " + d.total.toLocaleString();
    } else {
        return 'Country: ' + d.properties.name + "<br>Total Cases: " + ": No data.";
    }
  })

svg.call(tip);

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([500 / 2, 290 / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([0, 100, 1000, 10000, 100000, 1000000, 10000000])
  .range(d3.schemeReds[7]);
var centered

function update_map(map_data, date){
  data.clear()
  $.each(map_data, function(k,v){
    $.each(v.data, function(k1,v1){
      if(v1.date == date && v1.total_cases!=undefined){
        data.set(k, v1.total_cases)
      }
    })
  })
  d3.json("data/geojson.json").then(function(topo) {
    d3.selectAll("#map > svg > g").remove();
    // Draw the map
    g = svg.append('g')
    if(country_name.text()!='WorldWide'){
        g.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px")
    }
    path = g.selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      .attr('stroke', 'black')
      .attr('stroke-width', '0.5px')
    
    path.on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .on("click", function(d) {
        onClick(d)
      })
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0
        if(d.properties.name==country_name.text()){
          return 'blue'
        }
        else{
          return colorScale(d.total);
        }
      });
  })
  
  //calculate the centroid using the bbox
  function getMyCentroid(element) {
    var bbox = element.getBBox();
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
  }

  function onClick(d){
    var selected_index
    country_name.text(d.properties.name)
    path.attr('fill', function (n, index) {
      if(d.id==n.id){
        selected_index = index
        return 'blue'
      }
      else{
        return colorScale(n.total);
      }
    })
    update2(d.id)

    if (d && centered !== d) {
      var centroid = getMyCentroid(path._groups[0][selected_index]);
      x = centroid[0];
      y = centroid[1];
      k = 3;
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    svg.select('g').transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");

    country_name.raise()
  }
}
