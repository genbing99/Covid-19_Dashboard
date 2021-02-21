// Refer to https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763

var formatDateIntoYear = d3.timeFormat("%Y");
var formatDateIntoMonth = d3.timeFormat("%b");
var formatDateIntoDay = d3.timeFormat("%d/%m/%y");
var formatDate = d3.timeFormat("%b %Y");
var parseDate = d3.timeFormat("%Y-%m-%d");

var startDate = new Date("2020-01-22"),
    endDate = new Date("2021-01-30");

var margin = {top:0, right:50, bottom:0, left:50},
    width = 600 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

var svg = d3.select("#vis")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("x", "100")

var moving = false;
var currentValue = 0;
var targetValue = width;

var playButton = d3.select("#play-button");

var x_scale = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height/1.8 + ")");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x_scale.range()[0])
    .attr("x2", x_scale.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
        .on("start.interrupt", function() { slider.interrupt(); })
        .on("start drag", function() {
          currentValue = d3.event.x;
          if(currentValue<0){
            currentValue=0
          }
          update_slider(x_scale.invert(currentValue)); 
        })
    );

slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
    .data(x_scale.ticks(10))
    .enter()
    .append("text")
    .attr("x", x_scale)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatDateIntoMonth(d); });

var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9);
    
slider.append("text")  
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDateIntoDay(startDate))
    .attr("transform", "translate(-5,40)")  
    .attr('font-size', 12)

slider.append("text")  
  .attr("class", "label")
  .attr("text-anchor", "middle")
  .text(formatDateIntoDay(endDate))
  .attr("transform", "translate(" + (width+10) + ",40)")
  .attr('font-size', 12)

var labelDate = slider.append("text")  
  .attr("class", "label")
  .attr("text-anchor", "middle")
  .text(formatDateIntoDay(startDate))
  .attr("transform", "translate(0,-25)")

playButton
  .on("click", function() {
  var button = d3.select(this);
  if (button.text() == "Pause") {
    moving = false;
    clearInterval(timer);
    // timer = 0;
    button.text("Play");
  } else {
    moving = true;
    timer = setInterval(step, 100);
    button.text("Pause");
  }
  console.log("Slider moving: " + moving);
})

function step() {
  update_slider(x_scale.invert(currentValue));
  currentValue = currentValue + (targetValue/101);
  if (currentValue > targetValue) {
    moving = false;
    currentValue = 0;
    clearInterval(timer);
    // timer = 0;
    playButton.text("Play");
    console.log("Slider moving: " + moving);
  }
}

function update_slider(h) {
  // update position and text of label according to slider scale
  handle.attr("cx", x_scale(h));
  labelDate
    .attr("x", x_scale(h))
    .text(formatDateIntoDay(h));
  update(parseDate(h), '')
}
