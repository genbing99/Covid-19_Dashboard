// Tweets
var tweets_loc = d3.select("#tweets")

tweets_loc.append('svg')
  .attr('transform', 'translate(90,0)')
  .attr('width', 180)
  .attr('height', 40)
  .append('text')
  .text('Realtime Tweets')
  .attr('y', 25) 
  .attr('x', 10)
  .attr('font-size', 19)  

var tweets_container = tweets_loc
  .append("div").attr("id", "tweets_container")
  .append("svg")
  .attr("viewBox", "375,0,330,120")
  .attr('width', 2000)
  .attr('height', 220)
  .append('g');

var tweets_text = tweets_container.append('g')
var score = 0

var sentiment_svg = d3.select('#tweets')
  .append('svg')
  .attr('width', 350)
  .attr('height', 50)

var sentiment_score = sentiment_svg.append('text')
  .attr('x', 250)
  .attr('y', 20)
  .text('Keyword -->')
  //.text('Sentiment Score: -%')
  
var count_display = 10
var regexp = new RegExp('#([^\\s]*)','g');
var tweets_arr = [];
var score = 0

function update_tweets(){ //Update text if all success
  tweets_arr.sort((a,b) => (a.count > b.count) ? 1 : ((b.count > a.count) ? -1 : 0))
  tweets_text.selectAll('text').remove()
  for (i=1; i <= count_display; i++){
    sentiment = tweets_arr[i-1].sentiment[0] //First return sentiment only
    console.log(tweets_arr[i-1].text + '  ' + sentiment)
    if(sentiment=='Positive'){
      score+=100
    }
    else if(sentiment=='Neutral'){
      score+=50
    }
    tweets_text.append('text')
    .text(i + ') ' + tweets_arr[i-1].text)
    .attr('x', 0)
    .attr('y', 0.5 + (i*11.5))
    .attr('font-size', 7)
    .attr('fill', sentiment=='Positive'? 'green' : sentiment=='Negative'? 'red' : 'black');
  }
  sentiment_score.text('Sentiment Score: ' + score/count_display + '%') //Positive=100, Neutral=50, Negative=0, Divide by total tweets
  tweets_arr = []
  score = 0
}

function tweets_sentiment(count, text){
  var formData = new FormData();
  formData.append('text', text.replace(regexp, '')); // Remove Hashtags
  $.ajax({
    method: 'POST',
    url: 'https://api.deepai.org/api/sentiment-analysis',
    headers: {
      "api-key": "42c3d62d-9d50-4c4a-a1c2-a6467a96f275", //Change api-key due to credit issue
    },
    cache : false,
    dataType    : 'json',
    processData : false,
    contentType: 'multipart/form-data; boundary=----WebKitFormBoundarydHlkzFE0yo9FaRyc',
    data: formData,
    success: function(res){
      tweets_arr.push({'text': text, 'sentiment': res.output, 'count': count})
      if(tweets_arr.length==count_display){
        update_tweets()
      }
    },
  })
}

function without_sentiment(count, text){
  if(count==1){
    tweets_text.selectAll('text').remove()
  }
  tweets_text.append('text')
    .text(count + ') ' + text)
    .attr('x', 1)
    .attr('y', 0.5 + (count*11.5))
    .attr('font-size', 7)
}

function load_tweets(){
  var count = 0
  var all_text = ''
  $.ajax({
    type: 'GET',
    url: 'js/queryTwitter.php',
    success: function(tweets_list) {
      tweets_list = JSON.parse(tweets_list);
      $.each(tweets_list, function(index, tweets) {
        $.each(tweets, function(index, tweet){
          if(parseInt(tweet.retweet_count)==0 && !tweet.in_reply_to_status_id){ //Ignore the retweet and replies
            //text = tweet.text.replace(regexp, '') // Remove Hashtags
            text = tweet.full_text
            text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
            if(text.length>7){ //#Covid -> Length is 6
              count++
              all_text += text
              if(count<=count_display){
                //tweets_sentiment(count, text)
                without_sentiment(count, text)
              }
            }
          }
        })
      })
    }
  }).then(function(){
    drawWordCloud(all_text)
    console.log('Total tweets from 200 tweets: ' + count);
  });
}

// Credit Issue
load_tweets();
setInterval(function(){
  load_tweets();
}, 20000);
        