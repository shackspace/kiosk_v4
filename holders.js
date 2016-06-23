function createGraph(){
	r = new XMLHttpRequest();
	r.open("GET", "http://lounge.kiosk.shack:8088");
	r.onreadystatechange=function(){
		response = JSON.parse(this.responseText);
		
		holders = [];
		durations = [];
		for(var key in response) {
			durations.push(parseFloat(response[key]))
		}
		console.log(durations)
 		durations.sort(function(a,b) { return a - b;});
 		durations.reverse();
		console.log(durations)
		console.log(response)
		
		durationHours = []
		for (var duration of durations){
			console.log(durations)
			for (var keyholder in response){
				if (response[keyholder] == duration){
					holders.push(keyholder);
				}
			}
			durationHours.push(duration/3600)
			
		}
		
		console.log(holders)
		
		var data = {
			labels: holders,
			datasets:[{
				data: durationHours
			}]
		};

		var options = {
			scaleBeginAtZero : true,
			scaleFontSize: 24,
			scaleFontColor: "#bbb",
			responsive: false,
			showTooltips: false
		};
		
		//Create Chart
		console.log("Created");
		mateChart = new Chart(ctx).Bar(data, options);
		
		for(barNr in mateChart.datasets[0].bars){
			mateChart.datasets[0].bars[barNr].fillColor = "#"+((1<<24)*Math.random()|0).toString(16);
		}
		mateChart.update()

	}
	r.send();
}

document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		ctx = document.getElementById("holderChart").getContext("2d");
		createGraph();
	}
}
