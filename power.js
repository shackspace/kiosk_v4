function createGraph(){
	if(updateTimer != null){
		window.clearInterval(updateTimer); //Remove the autoupdate till the graph is loaded
	}

	var powerRequest = null;
	powerRequest = new XMLHttpRequest();
	powerRequest.open("GET", "http://glados.shack/siid/apps/powermeter.py?n=" + jumpInterval*150); //A tick is two seconds long and we start by covering 5 Minutes
	powerRequest.setRequestHeader("Content-type","application/json");

	powerRequest.onreadystatechange=function(){
		if(powerRequest.readyState==4 && powerRequest.status==200){
			response = JSON.parse(this.responseText);
			console.log(response);
			var labelArray = [];
			var dataArray = [];

			for(var i = 0; i<response.Total.length; i=i+jumpInterval){
				labelArray.push("");
				dataArray.push(response.Total[i]);
			}
			
			var data = {
				labels: labelArray,
				series:[{
					data: dataArray
				}]
			};

			var options = {
				width: '1050px',
				height: '730px',
				showPoint: false,
				lineSmooth: false,
				axisX: {
					showGrid: false,
					showLabel: false,
				},
				axisY: {
					labelInterpolationFnc: function skipLabels(value, index) {
						return index % 5  === 0 ? value : null;
					}
				}
			};
			
			//Create Chart
			console.log("Created");
			powerChart = new Chartist.Line("#powerChart", data, options);
			console.log(powerChart);
			
			document.getElementById("total").innerHTML = "Total: " + response.Total[response.Total.length-1];
			document.getElementById("l1").innerHTML = "L1: " + response["L1.Power"][response["L1.Power"].length-1];
			document.getElementById("l2").innerHTML = "L2: " + response["L2.Power"][response["L2.Power"].length-1];
			document.getElementById("l3").innerHTML = "L3: " + response["L3.Power"][response["L3.Power"].length-1];

			updateTimer = window.setInterval(function(){updateDiagramm()}, 2000*jumpInterval); //Restart the timer
			registerClickListeners(); //Re-register the click listeners
		}
	}

	powerRequest.send();
}

function updateDiagramm(){
	powerRequest = new XMLHttpRequest();
	powerRequest.open("GET", "http://glados.shack/siid/apps/powermeter.py?n=1");
	powerRequest.setRequestHeader("Content-type","application/json");

	powerRequest.onreadystatechange=function(){
		if(powerRequest.readyState==4 && powerRequest.status==200){	
			var response = JSON.parse(this.responseText);
			var newData = powerChart.data.series[0].data.slice(1,powerChart.data.series[0].data.length);
			newData.push(response.Total[0]);
			powerChart.data.series[0].data = newData;
			powerChart.update();

			document.getElementById("total").innerHTML = "Total: " + response.Total[0];
			document.getElementById("l1").innerHTML = "L1: " + response["L1.Power"][0];
			document.getElementById("l2").innerHTML = "L2: " + response["L2.Power"][0];
			document.getElementById("l3").innerHTML = "L3: " + response["L3.Power"][0];
		}
	}
	powerRequest.send();
}

function registerClickListeners(){
	document.getElementById("zoomPlus").onclick = function(){
		if(jumpInterval > 1){
			jumpInterval = jumpInterval/2;
			createGraph();
			document.getElementById("zoomMinus").src = "./images_power/Lupe-.png";
			document.getElementById("zoomPlus").onclick = ""; //Unregister the handler to prevent timing issues
		}

		if(jumpInterval == 1){
			document.getElementById("zoomPlus").src = "./images_power/Lupe+grey.png"; //You cant zoom no more
		}
		document.getElementById("duration").innerHTML = jumpInterval*5+"min";
	}

	document.getElementById("zoomMinus").onclick = function(){
		if(jumpInterval < 64){
			jumpInterval = jumpInterval*2;
			createGraph();
			document.getElementById("zoomPlus").src = "./images_power/Lupe+.png";
			document.getElementById("zoomMinus").onclick = "";
		}

		if(jumpInterval == 64){
			document.getElementById("zoomMinus").src = "./images_power/Lupe-grey.png"; //You cant zoom no more
		}
		document.getElementById("duration").innerHTML = jumpInterval*5+"min";
	}
}

var powerChart = null;
var requestNumber = 0;
var updateTimer = null;
var jumpInterval = 1; //Every n-th Element is drawn on the chart

document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		createGraph();
		registerClickListeners();
	}
}
