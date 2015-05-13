function setLightDisplay(id, state){
	document.getElementById(id+"-light-1").src= "./images_light/" + id + (state == "off" ? "-red" : "-green") + "-1.png";	
	lightIDs[id+"-light-1"] = (state == "off" ? 0 : 1);
	if(id == "5"){
		document.getElementById(id+"-light-2").src= "./images_light/" + id + (state == "off" ? "-red" : "-green") + "-2.png";
		lightIDs[id+"-light-2"] = (state == "off" ? 0 : 1);
	}
}

function bindClickEvents(){
	for(var id in lightIDs){
		document.getElementById(id).onclick = function(){
			var id = this.id.split("-")[0];
			var lightRequest = null;
			lightRequest = new XMLHttpRequest();
			lightRequest.open("PUT", "http://openhab.shack/lounge/"+id, true);
			lightRequest.setRequestHeader("Content-type","application/json");
			if(lightIDs[id+"-light-1"] == 0){
				lightRequest.send(JSON.stringify({"state": "on"})); //Start the request we just added
				lightIDs[id+"-light-1"] = 1;
				setLightDisplay(id, "on");
			}
			else{
				lightRequest.send(JSON.stringify({"state": "off"})); //Start the request we just added
				lightIDs[id+"-light-1"] = 0;
				setLightDisplay(id, "off");
			}
		}
	}
}

function updateLightStatus(){
	console.log("Update");
	for(var id in lightIDs){
		var lightRequest = null;
		lightRequest = new XMLHttpRequest();
		lightRequest.open("GET", "http://openhab.shack/lounge/"+id.split("-")[0], true);
		lightRequest.setRequestHeader("Content-type","application/json");
		lightRequest.onreadystatechange=function(){
			if(this.readyState==4 && this.status==200){
				response = JSON.parse(this.responseText);
				document.getElementById(response.id+"-light-1").src= "./images_light/" + response.id + (response.state == "off" ? "-red" : "-green") + "-1.png";
				setLightDisplay(response.id, response.state);
			}
		}
		lightRequest.send(); //Start the request we just added
	}
}

var lightIDs = {"1-light-1": 0,
				"2-light-1": 0,
				"3-light-1": 0,
				"4-light-1": 0,
				"5-light-1": 0,
				"5-light-2": 0,
				"6-light-1": 0,
				"7-light-1": 0,
				"8-light-1": 0}

document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		updateLightStatus();
		bindClickEvents();
		window.setInterval(function(){updateLightStatus()}, 5000);
	}
}
