var gauge = function (container, configuration, value) {
  var that = {};
  var config = {
    size: 200,
    clipWidth: 200,
    clipHeight: 110,
    ringInset: 20,
    ringWidth: 20,

    pointerWidth: 10,
    pointerTailLength: 5,
    pointerHeadLengthPercent: 0.9,

    minValue: 0,
    maxValue: 10,

    minAngle: -90,
    maxAngle: 90,

    transitionMs: 750,

    majorTicks: 5,
    labelFormat: d3.format('.3'),
    labelInset: 10,

    arcColorFn: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
  };

  var range = undefined;
  var r = undefined;
  var pointerHeadLength = undefined;

  var svg = undefined;
  var arc = undefined;
  var scale = undefined;
  var ticks = undefined;
  var tickData = undefined;
  var pointer = undefined;
  var gagues = undefined;

  var donut = d3.pie();

  function deg2rad(deg) {
    return deg * Math.PI / 180;
  }

  function newAngle(d) {
    var ratio = scale(d);
    var newAngle = config.minAngle + (ratio * range);
    return newAngle;
  }

  function configure(configuration) {
    var prop = undefined;
    for (prop in configuration) {
      config[prop] = configuration[prop];
    }

    range = config.maxAngle - config.minAngle;
    r = config.size / 2;
    pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

    // a linear scale that maps domain values to a percent from 0..1
    scale = d3.scaleLinear()
      .range([0, 1])
      .domain([0, 100]);

    arc = d3.arc()
      .innerRadius(r - config.ringWidth - config.ringInset)
      .outerRadius(r - config.ringInset)
      .startAngle(function (d, i) {
        var ratio = d[0] * range / (config.maxValue - config.minValue);
        return deg2rad(config.minAngle + ratio);
      })
      .endAngle(function (d, i) {
        var ratio = d[1] * range / (config.maxValue - config.minValue);
        return deg2rad(config.minAngle + ratio);
      });
  }
  that.configure = configure;

  function centerTranslation() {
    return 'translate(' + r + ',' + r + ')';
  }

  function isRendered() {
    return (svg !== undefined);
  }
  that.isRendered = isRendered;

  function render(newValue) {
    if(!isRendered()){

      value = newValue
      gauges = d3.selectAll(container).datum(function () { return this.dataset; });
  
      svg = gauges
        .append('svg:svg')
        .attr('class', 'gauge')
        .attr('width', config.clipWidth)
        .attr('height', config.clipHeight)
        .attr('transform', 'scale(0.4)translate(-190,-50)');
    
      var centerTx = centerTranslation();
  
      var arcs = svg.append('g')
        .attr('class', 'arc')
        .attr('transform', centerTx);
  
      arcs.selectAll('path')
        .data(function (d) {
          var ticks = [0, value, 100];
          return d3.pairs(ticks.concat(config.minValue, config.maxValue).sort(d3.ascending));
        })
        .enter().append('path')
        .attr('class', 'arcs_color')
        .attr('fill', function (d, i) {
          return config.arcColorFn(i);
        })
        .attr('d', arc);
  
      var lg = svg.append('g')
        .attr('class', 'label')
        .attr('transform', centerTx);
  
      lg.selectAll('text')
        .data(function (d) {
          return [0, 100];
        })
        .enter().append('text')
        .attr('transform', function (d) {
          var ratio = scale(d);
          var newAngle = config.minAngle + (ratio * range);
          return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r + 5) + ')';
        })
        .text(config.labelFormat);
  
      var lineData = [[config.pointerWidth / 2, 0],
      [0, -pointerHeadLength],
      [-(config.pointerWidth / 2), 0],
      [0, config.pointerTailLength],
      [config.pointerWidth / 2, 0]];
  
      var targetData = [[0, config.labelInset - r], [-config.pointerWidth / 2,
      config.labelInset - r - (config.pointerWidth / 2)], [config.pointerWidth / 2, config.labelInset - r - (config.pointerWidth / 2)]];
  
      var pointerLine = d3.line().curve(d3.curveMonotoneX);
  
      var pg = svg.append('g')
        .attr('class', 'pointer')
        .attr('transform', centerTx);
  
      pointer = pg.append('path')
        .attr('d', pointerLine(lineData)/*function(d) { return pointerLine(d) +'Z';}*/)
        .attr('transform', 'rotate(' + config.minAngle + ')')
  
      update(0);
    }
  }

  that.render = render;

  function update(value) {
    gauges = d3.selectAll(container).datum(function () { return this.dataset; });

    var pointers = gauges
      .select(".pointer path");

    pointers
      .transition()
      .duration(config.transitionMs)
      .ease(d3.easeElastic)
      .attr('transform', function (d) {
        var ratio = scale(value);
        var newAngle = config.minAngle + (ratio * range);
        if(!isNaN(newAngle))
          return 'rotate(' + newAngle + ')';
        else
          return
      });

    arc = d3.arc()
      .innerRadius(r - config.ringWidth - config.ringInset)
      .outerRadius(r - config.ringInset)
      .startAngle(function (d, i) {
        var ratio = d[0] * range / (config.maxValue - config.minValue);
        return deg2rad(config.minAngle + ratio);
      })
      .endAngle(function (d, i) {
        var ratio = d[1] * range / (config.maxValue - config.minValue);
        return deg2rad(config.minAngle + ratio);
      });

    gauges.selectAll(".arcs_color").remove()

    var centerTx = centerTranslation();

    var arcs = svg.append('g')
      .attr('class', 'arc')
      .attr('transform', centerTx);

    arcs.selectAll('path')
      .data(function (d) {
        var ticks = [0, value, 100];
        return d3.pairs(ticks.concat(config.minValue, config.maxValue).sort(d3.ascending));
      })
      .enter().append('path')
      .attr('class', 'arcs_color')
      .attr('fill', function (d, i) {
        return config.arcColorFn(i);
      })
      .attr('d', arc);
  }

  configure(configuration);
  that.update = update;
  return that;
};

var powerGauge = gauge('.power-gauge1', {
  size: 300,
  clipWidth: 300,
  clipHeight: 180,
  ringWidth: 60,
  maxValue: 100,
  transitionMs: 2000,
  arcColorFn: d3.scaleOrdinal().range(['lightgray', 'red'])
}, 50);

var powerGauge2 = gauge('.power-gauge2', {
  size: 300,
  clipWidth: 300,
  clipHeight: 180,
  ringWidth: 60,
  maxValue: 100,
  transitionMs: 2000,
  arcColorFn: d3.scaleOrdinal().range(['lightgray', 'red'])
}, 50);

var powerGauge3 = gauge('.power-gauge3', {
  size: 300,
  clipWidth: 300,
  clipHeight: 180,
  ringWidth: 60,
  maxValue: 100,
  transitionMs: 2000,
  arcColorFn: d3.scaleOrdinal().range(['lightgray', 'red'])
}, 50);

var powerGauge4 = gauge('.power-gauge4', {
  size: 300,
  clipWidth: 300,
  clipHeight: 180,
  ringWidth: 60,
  maxValue: 100,
  transitionMs: 2000,
  arcColorFn: d3.scaleOrdinal().range(['lightgray', 'red'])
}, 50);

function update_gauge_pos_rate(data, date, country_id) {
  set_to_zero = true
  // just pump in random data here...
  if(data[country_id]){ //Check if country id exist
    $.each(data[country_id].data, function(k,v){
      if(v.date == date){
        set_to_zero = false
        value = v.total_deaths / v.total_cases
        }
    })
  }
  if(set_to_zero || isNaN(value)){
    $('.power-gauge1').siblings("span").text('Unknown');
    powerGauge.render(0);
    powerGauge.update(0)
  }
  else{
    $('.power-gauge1').siblings("span").text(d3.format('.2%')(value));
    value*=100
    powerGauge.render(value);
    powerGauge.update(value)
  }
}

function update_gauge_vaccinated(data, date, country_id) {
  set_to_zero = true
  // just pump in random data here...
  if(data[country_id]){ //Check if country id exist
    $.each(data[country_id].data, function(k,v){
      if(v.date == date){
        set_to_zero = false
        value = v.total_vaccinations / data[country_id].population
      }
    })
  }
  if(set_to_zero || isNaN(value)){
    $('.power-gauge2').siblings("span").text('0%');
    powerGauge2.render(0);
    powerGauge2.update(0)
  }
  else{
    $('.power-gauge2').siblings("span").text(d3.format('.2%')(value));
    value*=100
    powerGauge2.render(value);
    powerGauge2.update(value)
  }
}

function update_gauge_stringency_index(data, date, country_id) {
  set_to_zero = true
  // just pump in random data here...
  if(data[country_id]){ //Check if country id exist
    $.each(data[country_id].data, function(k,v){
      if(v.date == date){
        set_to_zero = false
        value = v.stringency_index/100
      }
    })
  }
  if(set_to_zero || isNaN(value)){
    $('.power-gauge3').siblings("span").text('Unknown');
    powerGauge3.render(0);
    powerGauge3.update(0)
  }
  else{
    $('.power-gauge3').siblings("span").text(d3.format('.2%')(value));
    value*=100
    powerGauge3.render(value);
    powerGauge3.update(value)
  }
}


function update_gauge_positive_rate(data, date, country_id) {
  set_to_zero = true
  // just pump in random data here...
  if(data[country_id]){ //Check if country id exist
    $.each(data[country_id].data, function(k,v){
      if(v.date == date){
        set_to_zero = false
        value = v.positive_rate
      }
    })
  }
  if(set_to_zero || isNaN(value)){
    $('.power-gauge4').siblings("span").text('Unknown');
    powerGauge4.render(0);
    powerGauge4.update(0)
  }
  else{
    $('.power-gauge4').siblings("span").text(d3.format('.2%')(value));
    value*=100
    powerGauge4.render(value);
    powerGauge4.update(value)
  }
}