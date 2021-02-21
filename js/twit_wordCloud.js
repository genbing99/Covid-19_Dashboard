var common = '#covid, #covid19'
d3.text('data/stopWords.txt') // Read Stop Words
    .then(function(data) {
      var lines = data.split('\n')
      for (var i=0; i<lines.length; i++){
        common += (lines[i]+',') 
      }
    })

function drawWordCloud(text_string){ 
  d3.select('#wordCloud').select('svg').remove()
  //var common = "a,an,the,and,but,if,or,as, ...."; 
  var word_count = {}; 
  var words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/); 
    if (words.length == 1){ 
      word_count[words[0]] = 1; 
    } else { 
      words.forEach(function(word){ 
        var word = word.toLowerCase(); 
        if (word != "" && common.indexOf(word)==-1 && word.length>1){ 
          if (word_count[word]){ 
            word_count[word]++; 
          } else { 
            word_count[word] = 1; 
          } 
        } 
      }) 
    } 
  var word_entries = d3.entries(word_count); 
  // Remove less important word
  word_entries.forEach(function (item, index, data){ 
    if (item['value']<5)
      data.splice(index,1)
  })
  console.log('Total words in wordCloud: ' + word_entries.length)
  // Provide the code to generate the word cloud 
  var fill = d3.scaleOrdinal(d3.schemeCategory10); 
  d3.layout.cloud() 
    .size([500, 130]) 
    .words(word_entries
        .map(function(d) { 
            return {text: d.key, size: 8 + d.value * 5.0};})) 
        .padding(0.1) 
        .rotate(function() { return ~~(Math.random() * 2) * 90; }) 
        .font("Impact") 
        .fontSize(function(d) { return d.size; }) 
        .on("end", draw) 
        .start(); 

  function draw(words) { 
    d3.select("#wordCloud").append("svg") 
    .attr("width", 500) 
    .attr("height", 160) 
    .append("g") 
    .attr("transform", "translate(240,90)") 
    .selectAll("text") 
    .data(words) 
    .enter().append("text") 
    .style("font-size", function(d) { return d.size + "px"; }) 
    .style("font-family", "Impact") 
    .style("fill", function(d, i) { return fill(i); }) 
    .attr("text-anchor", "middle") 
    .attr("transform", function(d) { 
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; 
    }) 
    .text(function(d) { return d.text; }); 
  } 
}