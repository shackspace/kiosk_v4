function createGraph(){
	var mateRequest = null;
	var requestsCompleted = 0;
	var mateStates = {
		"Wasser": 0,
		"Mate Cola": 0,
		"Apfelschorle": 0,
		"ACE": 0,
		"Mate 1": 0,
		"Mate 2": 0
	};
		
	for(var requests = 1; requests <= 6; requests++){
		mateRequest = new XMLHttpRequest();
		if(requests <= 4){
			mateRequest.open("GET", "https://ora2.tutschonwieder.net:8443/apex/tensai-prod/v1/get/fuellstand/1/" + requests);
		}
		else{
			mateRequest.open("GET", "https://ora2.tutschonwieder.net:8443/apex/tensai-prod/v1/get/fuellstand/1/" + (requests+21));
		}
		mateRequest.setRequestHeader("Content-type","application/json");

		mateRequest.onreadystatechange=function(){
			if(this.readyState==4 && this.status==200){
				console.log(this);
				var response = JSON.parse(this.responseText);
				var shaftID = this.responseURL.split("/")[this.responseURL.split("/").length-1]; //The last number in the URL is the shaftID

				//Update the correct field
				if(shaftID == 1){
					mateStates.Wasser = response.fuellstand;
				}
				else if(shaftID == 2){
					mateStates["Mate Cola"] = response.fuellstand;
				}
				else if(shaftID == 3){
					mateStates.Apfelschorle = response.fuellstand;
				}
				else if(shaftID == 4){
					mateStates.ACE = response.fuellstand;
				}
				else if(shaftID == 26){
					mateStates["Mate 1"] = response.fuellstand;
				}
				else if(shaftID == 27){
					mateStates["Mate 2"] = response.fuellstand;
				}
				requestsCompleted++;

				//Create the chart
				if(requestsCompleted == 6){
					var data = {
						labels: ["Wasser", "Mate Cola", "Apfelschorle", "ACE", "Mate 1", "Mate 2"],
						datasets:[{
							data: [mateStates.Wasser, mateStates["Mate Cola"], mateStates.Apfelschorle, mateStates.ACE, mateStates["Mate 1"], mateStates["Mate 2"]]
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

					//Color the bars based on their size
					for(barNr in mateChart.datasets[0].bars){
						if(mateChart.datasets[0].bars[barNr].key != "Mate Cola"){
							if(mateChart.datasets[0].bars[barNr].value > 13){
								mateChart.datasets[0].bars[barNr].fillColor = "green";
							}
							else if(mateChart.datasets[0].bars[barNr].value > 6){
								mateChart.datasets[0].bars[barNr].fillColor = "greenyellow";
							}
							else if(mateChart.datasets[0].bars[barNr].value > 3){
								mateChart.datasets[0].bars[barNr].fillColor = "yellow";
							}
							else{
								mateChart.datasets[0].bars[barNr].fillColor = "red"
							}
							
						}
						mateChart.update();
					}
				}
			}
		}

		mateRequest.send();
		
	}
}

var mateChart = null;
var updateTimer = null;
var ctx;

document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		ctx = document.getElementById("mateChart").getContext("2d");
		createGraph();
	}
}
