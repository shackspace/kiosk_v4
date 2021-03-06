function createGraph(){
	if(updateTimer != null){
		window.clearInterval(updateTimer); //Remove the autoupdate till the graph is loaded
	}

	var powerRequest = null;
	powerRequest = new XMLHttpRequest();

	var url = "http://influx.shack/query?pretty=false&db=telegraf&q=";
	var time_range = jumpInterval*300 + "s"; //we start by covering 5 Minutes
 	var time_step = Math.round(Math.max(1, jumpInterval*150/1000)) + "s";
	
	var query = encodeURI(
"SELECT mean(\"value\") FROM \"Power\" WHERE (\"topic\" = '/power/total/L1/Power') AND time >= now() - " + time_range + " GROUP BY time(" + time_step + ") fill(null);\
SELECT mean(\"value\") FROM \"Power\" WHERE (\"topic\" = '/power/total/L2/Power') AND time >= now() - " + time_range + " GROUP BY time(" + time_step + ") fill(null);\
SELECT mean(\"value\") FROM \"Power\" WHERE (\"topic\" = '/power/total/L3/Power') AND time >= now() - " + time_range + " GROUP BY time(" + time_step + ") fill(null)");
	query = query.replace(/;/g, "%3B");

	powerRequest.open("GET", url + query);
	powerRequest.setRequestHeader("Content-type","application/json");

	powerRequest.onreadystatechange=function(){
		if(powerRequest.readyState==4 && powerRequest.status==200){
			response = JSON.parse(this.responseText);
			console.log(this);
			var labelArray = [];
			var totalArray = [];
			var l1Array = [];
			var l2Array = [];
			var l3Array = [];

			var lastL1Value, lastL2Value, lastL3Value, lastTotalValue;

			for(var i = 0; i<response["results"][0]["series"][0]["values"].length; i=i+jumpInterval){
				labelArray.push(i);

				lastL1Value = response["results"][0]["series"][0]["values"][i][1]*1;
				lastL2Value = response["results"][1]["series"][0]["values"][i][1]*1;
				lastL3Value = response["results"][2]["series"][0]["values"][i][1]*1;
				lastTotalValue = lastL1Value + lastL2Value + lastL3Value;

				l1Array.push(lastL1Value);
				l2Array.push(lastL2Value);
				l3Array.push(lastL3Value);

				totalArray.push(lastTotalValue);
			}
			
			var data = {
				labels: labelArray,
				series:[{
					data: totalArray
				},
				{
					data: l1Array
				},
				{
					data: l2Array
				},
				{
					data: l3Array
				}
				]
			};

			var options = {
				width: '1050px',
				height: '850px',
				showPoint: false,
				lineSmooth: false,
				onlyInteger: true,
				
				low: 0,
				axisX: {
					showGrid: false,
					showLabel: false,
				},
				axisY: {
					labelInterpolationFnc: function skipLabels(value, index) {
						return index % 5  === 0 ? value : null;
					},
					offset: 90
				}
			};
			
			//Create Chart
			console.log("Created");
			powerChart = new Chartist.Line("#powerChart", data, options);
			console.log(powerChart);
			
			document.getElementById("total").innerHTML = "Total: " + lastTotalValue + "W";
			document.getElementById("l1").innerHTML = "L1: " + lastL1Value + "W";
			document.getElementById("l2").innerHTML = "L2: " + lastL2Value + "W";
			document.getElementById("l3").innerHTML = "L3: " + lastL3Value + "W";

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
			var newTotalData = powerChart.data.series[0].data.slice(1,powerChart.data.series[0].data.length);
			var newL1Data = powerChart.data.series[1].data.slice(1,powerChart.data.series[1].data.length);
			var newL2Data = powerChart.data.series[2].data.slice(1,powerChart.data.series[2].data.length);
			var newL3Data = powerChart.data.series[3].data.slice(1,powerChart.data.series[3].data.length);
			newTotalData.push(response.Total[0]);
			newL1Data.push(response["L1.Power"][0]);
			newL2Data.push(response["L2.Power"][0]);
			newL3Data.push(response["L3.Power"][0]);
			powerChart.data.series[0].data = newTotalData;
			powerChart.data.series[1].data = newL1Data;
			powerChart.data.series[2].data = newL2Data;
			powerChart.data.series[3].data = newL3Data;
			powerChart.update();

			document.getElementById("total").innerHTML = "Total: " + response.Total[0]+"W";
			document.getElementById("l1").innerHTML = "L1: " + response["L1.Power"][0]+"W";
			document.getElementById("l2").innerHTML = "L2: " + response["L2.Power"][0]+"W";
			document.getElementById("l3").innerHTML = "L3: " + response["L3.Power"][0]+"W";
		}
	}
	powerRequest.send();
	updatePowerrawValues();
}

function updatePowerrawValues(){
	//We do not get all values from glados, so we ask powerraw directly
	rawRequest = new XMLHttpRequest();
	rawRequest.open("GET", "http://powerraw.shack:11111");
	rawRequest.onreadystatechange=function(){
		if(rawRequest.readyState==4){
			splitRequest = this.responseText.split("\n");
			for(key in splitRequest){
				if(splitRequest[key].substr(0, 10) == "1-0:32.7.0"){
					document.getElementById("voltagel1").innerHTML = splitRequest[key].split("(")[1].split("*")[0] +"V";
				}
				else if(splitRequest[key].substr(0, 10) == "1-0:52.7.0"){
					document.getElementById("voltagel2").innerHTML = splitRequest[key].split("(")[1].split("*")[0] +"V";
				}
				else if(splitRequest[key].substr(0, 10) == "1-0:72.7.0"){
					document.getElementById("voltagel3").innerHTML = splitRequest[key].split("(")[1].split("*")[0] +"V";
				}
			}
		}
	}
	rawRequest.send();
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
		updatePowerrawValues();
		createGraph();
		registerClickListeners();
	}
}
