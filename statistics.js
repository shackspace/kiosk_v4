function requestMPDInformation(){
	var mpdRequest = null;
	mpdRequest = new XMLHttpRequest();
	mpdRequest.open("GET", "http://kiosk.shack:8080/mpd/status", true);
	mpdRequest.setRequestHeader("Content-type","application/json");

	mpdRequest.onreadystatechange=function(){
		if(mpdRequest.readyState==4 && mpdRequest.status==200){
			response = JSON.parse(mpdRequest.responseText);
			console.log(response);
			if(response.artist == "undefined" && response.title == "undefined"){
				document.getElementById("mpd").innerHTML= "MPD disabled"
			}
			else{
				document.getElementById("mpd").innerHTML=response.artist + " - " + response.title;
			}
		}
	}

	mpdRequest.send();
}

function requestPowerInformation(){
	var powerRequest = null;
	powerRequest = new XMLHttpRequest();
	powerRequest.open("GET", "http://glados.shack/siid/apps/powermeter.py?n=1", true);
	powerRequest.setRequestHeader("Content-type","application/json");

	powerRequest.onreadystatechange=function(){
		if(powerRequest.readyState==4 && powerRequest.status==200){
			response = JSON.parse(powerRequest.responseText);
			console.log(response);
			document.getElementById("power").innerHTML=response.Total[0] + " Watt";
		}
	}

	powerRequest.send();
}

function requestTempInformation(){
	var tempRequest = null;
	tempRequest = new XMLHttpRequest();
	tempRequest.open("GET", "http://heidi:8888/api/env/temperature", true);
	tempRequest.setRequestHeader("Content-type","application/json");

	tempRequest.onreadystatechange=function(){
		if(tempRequest.readyState==4 && tempRequest.status==200){
			response = JSON.parse(tempRequest.responseText);
			console.log(response);
			if(response[0] != "No Data"){
				document.getElementById("temp").innerHTML=response[0] + " &degC";
			}
		}
	}

	tempRequest.send();
}

function requestHumidityInformation(){
	var humidityRequest = null;
	humidityRequest = new XMLHttpRequest();
	humidityRequest.open("GET", "http://heidi:8888/api/env/humidity", true);
	humidityRequest.setRequestHeader("Content-type","application/json");

	humidityRequest.onreadystatechange=function(){
		if(humidityRequest.readyState==4 && humidityRequest.status==200){
			response = JSON.parse(humidityRequest.responseText);
			console.log(response);
			if(response[0] != "No Data"){
				document.getElementById("humidity").innerHTML=response[0] + "%";
			}
		}
	}

	humidityRequest.send();
}

function requestBTCInformation(){
	var btcRequest = null;
	btcRequest = new XMLHttpRequest();
	btcRequest.open("GET", "http://kiosk.shack:8080/btc", true);
	btcRequest.setRequestHeader("Content-type","application/json");

	btcRequest.onreadystatechange=function(){
		if(btcRequest.readyState==4 && btcRequest.status==200){
			response = JSON.parse(btcRequest.responseText);
			console.log(response);
			document.getElementById("btc").innerHTML=response.btc + "$";
		}
	}

	btcRequest.send();
}

function requestKeyInformation(){
	var keyRequest = null;
	keyRequest = new XMLHttpRequest();
	keyRequest.open("GET", "http://portal.shack:8088/status", true);
	keyRequest.setRequestHeader("Content-type","application/json");

	keyRequest.onreadystatechange=function(){
		if(keyRequest.readyState==4 && keyRequest.status==200){
			response = JSON.parse(keyRequest.responseText);
			console.log(response);
			document.getElementById("keyholder").innerHTML="Key: " + response.keyholder;
		}
	}

	keyRequest.send();
}

function requestPeopleInformation(){
	var peopleRequest = null;
	peopleRequest = new XMLHttpRequest();
	peopleRequest.open("GET", "http://shackles.shack/api/user", true);
	peopleRequest.setRequestHeader("Content-type","application/json");

	peopleRequest.onreadystatechange=function(){
		if(peopleRequest.readyState==4 && peopleRequest.status==200){
			document.getElementById("users").innerHTML = "";
			if(peopleRequest.responseText != "{}"){
				response = JSON.parse(peopleRequest.responseText);
				console.log(response);
				for(key in response){
					if(response[key]["status"] != "logged out"){
						document.getElementById("users").innerHTML = document.getElementById("users").innerHTML + " " + response[key]["_id"] + ",";
					}
				}
			}
		}
	}

	peopleRequest.send();
}

function calculateSack(){
	var gelberSack = ["13.04.", "04.05.", "23.05.","15.06.","06.07.","27.07.","17.08.","07.09.","28.09.","19.10.","09.11.","30.11.","21.12."];
	var now = new Date();
	for(key in gelberSack){
		if(gelberSack[key].slice(3,5) >= now.getMonth()){
			if(gelberSack[key].slice(0, 2) >= now.getDate()){
				document.getElementById("sack").innerHTML = gelberSack[key];
				break;
			}
		}
	}
	
}
document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		requestPeopleInformation();
		requestMPDInformation();
		requestPowerInformation();
		requestTempInformation();
		requestHumidityInformation();
		requestBTCInformation();
		requestKeyInformation();
		calculateSack();

		setInterval(function(){
			requestPeopleInformation();
			requestMPDInformation();
			requestPowerInformation();
			requestTempInformation();
			requestHumidityInformation();
			requestBTCInformation();
			requestKeyInformation();
		}, 10000);
	}
}
