var alternator = 0;

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

	updateMPDButton();
}

function updateMPDButton(){
	var mpdStatus = new XMLHttpRequest();
	mpdStatus.open("GET", "http://shack.shack:5000/mpd/lounge/status", true);
	mpdStatus.setRequestHeader("Content-type","application/json");

	mpdStatus.onreadystatechange=function(){
		if(mpdStatus.readyState==4 && mpdStatus.status==200){
			response = JSON.parse(mpdStatus.responseText);
			console.log(response);
			if(response.status == "play"){
				document.getElementById("MPDbutton").src = "./images_home/logo_mpd_stop.png";
			}
			else{
				document.getElementById("MPDbutton").src = "./images_home/logo_mpd_start.png";
			}
		}
	}

	mpdStatus.send();	

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
			if(!response.file){
				document.getElementById("mpd").innerHTML= "MPD disabled"
			}
			else{
				if(!response.title){
					document.getElementById("mpd").innerHTML= response.file;
				}
				else{
					document.getElementById("mpd").innerHTML= response.title;	
				}
			}

			//A little "responsive" scaling here. Not very responsive indeed.
			if(document.getElementById("mpd").innerHTML.length*25 > document.getElementById("mpdDiv").clientWidth){
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
	var keyRequest = new XMLHttpRequest();
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

function requestGelberSack(){
	var sackRequest = new XMLHttpRequest();
	sackRequest.open("GET", "http://openhab.shack/muellshack/gelber_sack", true);
	sackRequest.setRequestHeader("Content-type","application/json");

	sackRequest.onreadystatechange=function(){
		if(sackRequest.readyState==4 && sackRequest.status==200){
			response = JSON.parse(sackRequest.responseText);
			var sackdate = new Date(response.gelber_sack);
			if ( isNaN( sackdate.getTime() ) ) {
				document.getElementById("gelbersack").innerHTML= "kein Termin vorhanden";
			} else {
				var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
				document.getElementById("gelbersack").innerHTML= "Gelber Sack: " + sackdate.toLocaleDateString('de-DE', options);
				if(sackdate.getTime() < Date.now()+60*60*24*1000){ //Color the date if its less than 24h away
					document.getElementById("gelbersack").style.backgroundColor = "#f00";
				}
				else{
					document.getElementById("gelbersack").style.backgroundColor = "#020";
				}
			}
		}
	}
	sackRequest.send();
}

function requestPapiermuell(){
	var sackRequest = new XMLHttpRequest();
	sackRequest.open("GET", "http://openhab.shack/muellshack/papiermuell", true);
	sackRequest.setRequestHeader("Content-type","application/json");

	sackRequest.onreadystatechange=function(){
		if(sackRequest.readyState==4 && sackRequest.status==200){
			response = JSON.parse(sackRequest.responseText);
			var sackdate = new Date(response.papiermuell);
			if ( isNaN( sackdate.getTime() ) ) {
				document.getElementById("papiermuell").innerHTML= "kein Termin vorhanden";
			} else {
				var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
				document.getElementById("papiermuell").innerHTML= "Papiermuell: " + sackdate.toLocaleDateString('de-DE', options);
				if(sackdate.getTime() < Date.now()+60*60*24*1000){ //Color the date if its less than 24h away
					document.getElementById("papiermuell").style.backgroundColor = "#f00";
				}
				else{
					document.getElementById("papiermuell").style.backgroundColor = "#020";
				}
			}
		}
	}
	sackRequest.send();
}


function requestRestmuell(){
	var sackRequest = new XMLHttpRequest();
	sackRequest.open("GET", "http://openhab.shack/muellshack/restmuell", true);
	sackRequest.setRequestHeader("Content-type","application/json");

	sackRequest.onreadystatechange=function(){
		if(sackRequest.readyState==4 && sackRequest.status==200){
			response = JSON.parse(sackRequest.responseText);
			var sackdate = new Date(response.restmuell);
			if ( isNaN( sackdate.getTime() ) ) {
				document.getElementById("restmuell").innerHTML= "kein Termin vorhanden";
			} else {
				var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
				document.getElementById("restmuell").innerHTML= "Restmuell: " + sackdate.toLocaleDateString('de-DE', options);
				if(sackdate.getTime() < Date.now()+60*60*24*1000){ //Color the date if its less than 24h away
					document.getElementById("restmuell").style.backgroundColor = "#f00";
				}
				else{
					document.getElementById("restmuell").style.backgroundColor = "#020";
				}
			}
		}
	}
	sackRequest.send();
}

function requestTemp(){
	console.log("log")
	var tempRequest = new XMLHttpRequest();
	tempRequest.open("GET", "http://smarthome.shack", true);
	tempRequest.setRequestHeader("Content-type","application/json");

	tempRequest.onreadystatechange=function(){
		if(tempRequest.readyState==4 && tempRequest.status==200){
			rt = tempRequest.responseText
			pos = rt.search("Humitidy : <b>")
			envstring = rt.substring(pos+14, pos+23).trim()
			console.log(envstring)
			document.getElementById("power").innerHTML=envstring
		}
	}
	tempRequest.send();
}

function switchPowerBarDisplay(){
	if(alternator%2 == 0){ //Alternate between Power and Temperatur/Humid
		requestPowerInformation();
	}
	else{
		requestTemp();
	}
	alternator++;
}

document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		requestMPDInformation();
		requestPowerInformation();
		requestBTCInformation();
		requestKeyInformation();
		requestGelberSack();
		requestPapiermuell();
		requestRestmuell();
		updateMPDButton();

		setInterval(function(){
			alternator++; //Increment to allow for changing displays
			if(alternator%2 == 0){ //Alternate between Power and Temperatur/Humid
				requestPowerInformation();
			}
			else{
				requestTemp();
			}

			requestMPDInformation();
			requestBTCInformation();
			requestKeyInformation();
			requestGelberSack();
			requestPapiermuell();
			requestRestmuell();
			updateMPDButton();
		}, 10000);
	}
}
