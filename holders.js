function createGraph(){
	r = new XMLHttpRequest();
	r.open("GET", "http://lounge.kiosk.shack:8088");
	r.onreadystatechange=function(){
		response = JSON.parse(this.responseText);
		
		holders = [];
		durations = [];
		for(var key in response) {
			holders.push(key)
			durations.push(response[key]/3600)
		}
		
		var data = {
			labels: holders,
			datasets:[{
				data: durations
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
