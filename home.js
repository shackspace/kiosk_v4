function toggleMPD(){
	mpdRequest = new XMLHttpRequest();
	mpdRequest.open("GET", "http://shack.shack:5000/mpd/lounge/toggle", true);
	mpdRequest.setRequestHeader("Content-type","application/json");
	mpdRequest.send();
	if(document.getElementById("MPDbutton").src.split("/").slice(-1)[0] == "logo_mpd_stop.png"){ //I just wanted to select the last element :(
		document.getElementById("MPDbutton").src = "./images_home/logo_mpd_start.png";
	}
	else{
		document.getElementById("MPDbutton").src = "./images_home/logo_mpd_stop.png";
	}
}

function requestMPDInformation(){
	var mpdRequest = null;
	mpdRequest = new XMLHttpRequest();
	mpdRequest.open("GET", "http://shack.shack:5000/mpd/lounge/song", true);
	mpdRequest.setRequestHeader("Content-type","application/json");

	mpdRequest.onreadystatechange=function(){
		if(mpdRequest.readyState==4 && mpdRequest.status==200){
			response = JSON.parse(mpdRequest.responseText);
			console.log(response);
			if(response.error){
				document.getElementById("mpd").innerHTML= "MPD disabled"
			}
			else{
				document.getElementById("mpd").innerHTML= response.title;
			}

			//A little "responsive" scaling here. Not very responsive indeed.
			if((response.artist + " - " + response.title).length*25 > document.getElementById("mpdDiv").clientWidth){
				document.getElementById("mpd").style.fontSize = "20px";
			}
			else{
				document.getElementById("mpd").style.fontSize = "40px";
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
	btcRequest.open("GET", "https://btc-e.com/api/3/ticker/btc_usd", true);
	btcRequest.setRequestHeader("Content-type","application/json");

	btcRequest.onreadystatechange=function(){
		if(btcRequest.readyState==4 && btcRequest.status==200){
			response = JSON.parse(btcRequest.responseText);
			console.log(response);
			document.getElementById("btc").innerHTML=response.btc_usd.avg.toString().substring(0, 5) + "$";
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
			if(response.status == "closed"){
				document.getElementById("keyholder").style.backgroundColor = "#f00";
			}
			else{
				document.getElementById("keyholder").style.backgroundColor = "#002";
			}
		}
	}

	keyRequest.send();
}

document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		requestMPDInformation();
		requestPowerInformation();
		requestTempInformation();
		requestHumidityInformation();
		requestBTCInformation();
		requestKeyInformation();

		setInterval(function(){
			requestMPDInformation();
			requestPowerInformation();
			requestTempInformation();
			requestHumidityInformation();
			requestBTCInformation();
			requestKeyInformation();
		}, 10000);
	}
}
