var alternator = 1;
var cooldown = 0;

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
			document.getElementById("mpd").style.backgroundColor = "#440";
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
  requestMuell("gelber_sack","Gelber Sack")
}

function requestPapiermuell(){
  requestMuell("papiermuell","Papierm&uuml;ll")
}


function requestMuell(muell,fancyname){
	var Request = new XMLHttpRequest();
	Request.open("GET", "http://openhab.shack/muellshack/"+muell, true);
	Request.setRequestHeader("Content-type","application/json");

	Request.onreadystatechange=function(){
		if(Request.readyState==4 && Request.status==200){
			response = JSON.parse(Request.responseText);
			var sackdate = new Date(response[muell]);
			if ( isNaN( sackdate.getTime() ) ) {
				document.getElementById(muell).innerHTML= "kein Termin vorhanden";
			} else {
				var options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
				document.getElementById(muell).innerHTML= fancyname+": " + sackdate.toLocaleDateString('de-DE', options);
				if(sackdate.getTime() < Date.now()+60*60*24*1000){ //Color the date if its less than 24h away
					if (response['main_action_done']){
						document.getElementById(muell).style.color = "#000";
						document.getElementById(muell).style.backgroundColor = "#ff0";
					}else{
						document.getElementById(muell).style.backgroundColor = "#f00";
					}
          // also set muell img to visible
					document.getElementById(muell+"-img").style.visibility = "visible";
					document.getElementById(muell+"-text").style.visibility = "visible";
				}
				else{
					document.getElementById(muell).style.backgroundColor = "#020";
				}
			}
		}
	}
	Request.send();
}
function requestRestmuell(){
  requestMuell("restmuell","Restm&uuml;ll")
}

function requestTemp(){
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

function requestNetwork(){
	var tokenRequest =  new XMLHttpRequest();
	tokenRequest.open("GET", "./tokens.txt", true);
	tokenRequest.onreadystatechange=function(){
		if(tokenRequest.readyState==4 && tokenRequest.status==200){
			console.log(tokenRequest.responseText);
			var token = JSON.parse(tokenRequest.responseText).librenms;
			var networkRequest = new XMLHttpRequest();
			networkRequest.open("GET", "http://librenms.shack/api/v0/devices/1/ports/Gi2%2F1", true);
			networkRequest.setRequestHeader("X-Auth-Token", token);
			networkRequest.onreadystatechange=function(){
				if(networkRequest.readyState==4 && networkRequest.status==200){
					var nd = JSON.parse(networkRequest.responseText);
					var downstream = (nd.port.ifInOctets_rate*8/1024/1024);
					var upstream = (nd.port.ifOutOctets_rate*8/1024/1024);
					document.getElementById("mpd").style.fontSize = "38px"; //Reset the font size
					if(downstream > 35 || upstream > 6){
						document.getElementById("mpd").style.backgroundColor = "#f00"; //Color the background red if high load
					}
					document.getElementById("mpd").innerHTML = "&#x25BC; " + downstream.toString().substring(0,4) + " Mbit/s (" + (downstream*2).toString().substring(0, 4) + "%) - &#x25B2; " + upstream.toString().substring(0,4) + " Mbit/s (" + (upstream/0.1).toString().substring(0, 4) + "%)";
				}
			}
			networkRequest.send()
		}
	}
	tokenRequest.send()
}

function requestFeinstaub(){
	feinstaubRequest_sued = new XMLHttpRequest();
	feinstaubRequest_sued.open("GET", "http://api.luftdaten.info/v1/data/?sensor=658&page_size=1", true);
	feinstaubRequest_sued.setRequestHeader("Content-type","application/json");
	feinstaubRequest_sued.onreadystatechange=function(){
		feinstaub_html = "Feinstaub: ";
		if(feinstaubRequest_sued.readyState==4 && feinstaubRequest_sued.status==200){
			response = JSON.parse(feinstaubRequest_sued.responseText);
			for (var idx in response.results[0].sensordatavalues) {
				var sdvalue = response.results[0].sensordatavalues[idx];
				if(sdvalue.value_type == 'P1') {
					console.log(sdvalue.value);
					feinstaub_html += " P1:" + sdvalue.value;
				}
				if(sdvalue.value_type == 'P2') {
					console.log(sdvalue.value);
					feinstaub_html += " P2:" + sdvalue.value;
			  	}
		  	}
		}
		document.getElementById("mpd").innerHTML = feinstaub_html;
	};
	feinstaubRequest_sued.send();
}

function alarm(){
	if(cooldown < 3){
		cooldown++;
	}
	else{
		cooldown = -100; //Prevent double playing
		new Audio('./images_home/alarm.mp3').play();
	}
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
			if(alternator%3 == 0){ //Alternate the displayed values
				requestPowerInformation();
				requestMPDInformation();
			}
			else if(alternator%3 == 1){
				requestTemp();
				requestNetwork();
			}
			else{
				requestFeinstaub()
				requestPowerInformation()
			}			

			requestBTCInformation();
			requestKeyInformation();
			requestGelberSack();
			requestPapiermuell();
			requestRestmuell();
			updateMPDButton();
			cooldown = 0;
		}, 10000);
	}
}
