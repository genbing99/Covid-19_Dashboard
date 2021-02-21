<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title> Covid-19 Tracker</title>

	<!-- Load CSS files -->
	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/style.css">
</head>

<style>
</style>

<body>
	<div id="dashboard" style="display:flex; flex-direction:row;">
		<div style="display:flex; flex-direction:column;">
			<h1> COVID-19 Tracker </h1>
			<div id="statistics"></div>
			<div id="tweets"></div>
		</div>
		<div style="display:flex; flex-direction:column;">
			<div id="vis">
				<button id="play-button">Play</button>
			</div>
			<div style="display:flex; flex-direction:row;">
				<div>
					<div id="map"></div>
					<div id='wordCloud'></div>
				</div>
				<div>
					<div style="display:flex; flex-direction:column;">
						<div style="display:flex; flex-direction:row;">
							<div class="gauge-container">
								<div style="position:absolute;margin-left:25px"> Death/Cases </div>
								<div class='power-gauge1'></div>
								<span></span>
							</div>
							<div class="gauge-container">
								<div style="position:absolute;margin-left:30px"> Vaccinated/ </div>
								<div style="position:absolute;margin-left:30px;margin-top:20px"> Population </div>
								<div class='power-gauge2'></div>
								<span></span>
							</div>
						</div>
						<div style="display:flex; flex-direction:row;">
							<div class="gauge-container">
								<div style="position:absolute;margin-left:15px;margin-top:10px"> Stringency Index </div>
								<div class='power-gauge3'></div>
								<span></span>
							</div>
							<div class="gauge-container">
								<div style="position:absolute;margin-left:28px;margin-top:10px"> Positive Rate </div>
								<div class='power-gauge4'></div>
								<span></span>
							</div>
						</div>
					</div>
					<div id='parallel' style="text-align: center;">
						Total Cases Comparison
					</div>
				</div>
			</div>
			
		</div>
	</div>
	
	
	<!-- Load JS libraries: jQuery, D3 -->
	<script type='text/javascript' src="js/jquery.min.js"></script>
	<script type='text/javascript' src="https://d3js.org/d3.v5.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js"></script>
  <script src="util/d3.layout.cloud.js"></script>

	<!-- Load Covid Data -->
	<script type="text/javascript">
		var allData = [];
		var date = ''
		var country_id = 'OWID_WRL'
		var prev_country_id = 'OWID_WRL'
		d3.json("data/owid-covid-data.json").then(function(data) {
			allData = data
			date = '2020-01-22'
			//date = allData['OWID_WRL'].data[allData['OWID_WRL'].data.length-1].date //Initial date
			update(date, country_id)
		})
		// For Date Change
		function update(date_chosen, country_id){
			if(country_id==''){
				country_id=prev_country_id
			}
			date = date_chosen
			update_statistics(allData, date, country_id)
			update_map(allData, date)
			update_gauge_pos_rate(allData, date, country_id)
			update_gauge_vaccinated(allData, date, country_id)
			update_gauge_stringency_index(allData, date, country_id)
			update_gauge_positive_rate(allData, date, country_id)
			update_parallel(allData, date, country_id)
		}
		// For Country Change
		function update2(country_id){
			prev_country_id = country_id
			update_statistics(allData, date, country_id)
			update_gauge_pos_rate(allData, date, country_id)
			update_gauge_vaccinated(allData, date, country_id)
			update_gauge_stringency_index(allData, date, country_id)
			update_gauge_positive_rate(allData, date, country_id)
			update_parallel(allData, date, country_id)
		}


	</script>
	<!-- Date Slider -->
	<script type='text/javascript' src="js/date.js"></script>
	<!-- Map -->
	<script type='text/javascript' src="js/map.js"></script>
	<!-- Statistics Text -->
	<script type='text/javascript' src="js/statistics.js"></script>
	<!-- Realtime Tweets -->
	<script type='text/javascript' src="js/twit.js"></script>
	<!-- Solid Gauge -->
	<script type='text/javascript' src="js/gauge.js"></script>
	<!-- Word Cloud -->
	<script type='text/javascript' src="js/twit_wordCloud.js"></script>
	<!-- Parallel Coordinates -->
	<script type='text/javascript' src="js/parallel.js"></script>
</body>

</html>