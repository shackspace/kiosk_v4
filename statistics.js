function requestMPDInformation(){
	var mpdRequest = null;
	mpdRequest = new XMLHttpRequest();
	mpdRequest.open("GET", "http://kiosk.shack:8080/mpd/status", true);
	mpdRequest.setRequestHeader("Content-type","application/json");

	mpdRequest.onreadystatechange=function(){
		if(mpdRequest.readyState==4 && mpdRequest.status==200){
			response = JSON.parse(mpdRequest.responseText);
			console.log(response);
			if(response.error){
				document.getElementById("mpd").innerHTML= "MPD disabled"
			}
			else{
				if(!response.title){
					document.getElementById("mpd").innerHTML= response.file;	
				}
				else{
					document.getElementById("mpd").innerHTML=response.title;
				}	
				
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
			document.getElementById("keyholder").innerHTML= response.keyholder;
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

function requestHackerspaceInformation(){
	var listRequest = null;
	listRequest = new XMLHttpRequest();
	listRequest.open("GET", "http://localhost:8080/wd.lst", true);
	//listRequest.setRequestHeader("Content-type","application/json");

	listRequest.onreadystatechange=function(){
		if(this.readyState==4 && this.status==200){
			var spaceURLs = this.responseText.split("\n");
			for(key in spaceURLs){
				url = spaceURLs[key];
				var hackerspaceRequest = null;
				hackerspaceRequest = new XMLHttpRequest();
				hackerspaceRequest.open("GET", url, true);
				hackerspaceRequest.setRequestHeader("Content-type","application/json");

				hackerspaceRequest.onreadystatechange = function(){
					if(this.readyState==4 && this.status==200){
						try{ //Spaces may implement the API wrong and we dont want to see all the errors
							var response = JSON.parse(this.responseText);
							if(response.state.open){
								spacesOpen++;
							}
							spacesTotal++;
							document.getElementById("spaces").innerHTML = spacesOpen + "/" + spacesTotal;
						}
						catch(e){
							console.log(e);
						}
					}
				}
				
				hackerspaceRequest.send();
			}
		}
	}

	listRequest.send();
}

function requestGelberSack(){
	var keyRequest = null;
	sackRequest = new XMLHttpRequest();
	sackRequest.open("GET", "http://openhab.shack/muellshack/gelber_sack", true);
	sackRequest.setRequestHeader("Content-type","application/json");

	sackRequest.onreadystatechange=function(){
		if(sackRequest.readyState==4 && sackRequest.status==200){
			response = JSON.parse(sackRequest.responseText);
			var sackdate = new Date(response.gelber_sack);
			if ( isNaN( sackdate.getTime() ) ) {
				document.getElementById("sack").innerHTML= "kein Termin vorhanden";
			} else {
				var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
				document.getElementById("sack").innerHTML= sackdate.toLocaleDateString('de-DE', options);
			}
		}
	}

	sackRequest.send();
}

function requestPapierMuell(){
	var keyRequest = null;
	papiermuellRequest = new XMLHttpRequest();
	papiermuellRequest.open("GET", "http://openhab.shack/muellshack/papiermuell", true);
	papiermuellRequest.setRequestHeader("Content-type","application/json");

	papiermuellRequest.onreadystatechange=function(){
		if(papiermuellRequest.readyState==4 && papiermuellRequest.status==200){
			response = JSON.parse(papiermuellRequest.responseText);
			var muelldate = new Date(response.papiermuell);
			if ( isNaN( muelldate.getTime() ) ) {
				document.getElementById("papier").innerHTML= "kein Termin vorhanden";
			} else {
				var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
				document.getElementById("papier").innerHTML= muelldate.toLocaleDateString('de-DE', options);
			}
		}
	}

	papiermuellRequest.send();
}

function requestRestMuell(){
	var keyRequest = null;
	restmuellRequest = new XMLHttpRequest();
	restmuellRequest.open("GET", "http://openhab.shack/muellshack/restmuell", true);
	restmuellRequest.setRequestHeader("Content-type","application/json");

	restmuellRequest.onreadystatechange=function(){
		if(restmuellRequest.readyState==4 && restmuellRequest.status==200){
			response = JSON.parse(restmuellRequest.responseText);
			var muelldate = new Date(response.restmuell);
			if ( isNaN( muelldate.getTime() ) ) {
				document.getElementById("rest").innerHTML= "kein Termin vorhanden";
			} else {
				var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
				document.getElementById("rest").innerHTML= muelldate.toLocaleDateString('de-DE', options);
			}
		}
	}

	restmuellRequest.send();
}

function requestIssues(){
    issuesRequest = new XMLHttpRequest();
    issuesRequest.open("GET", "https://api.github.com/repos/shackspace/spaceIssues/issues?state=open", true);
    issuesRequest.setRequestHeader("Content-type", "application/json");
    
    issuesRequest.onreadystatechange=function() {
        if(issuesRequest.readyState==4 && issuesRequest.status==200){
            response = JSON.parse(issuesRequest.responseText);
            document.getElementById("issues").innerHTML = response.length;
        }
    }

    issuesRequest.send();
}


function requestFeinstaub(){
  feinstaubRequest_sued = new XMLHttpRequest();
  feinstaubRequest_sued.open("GET", "http://api.dusti.xyz/v1/data/?sensor=61&page_size=1", true);
  feinstaubRequest_sued.setRequestHeader("Content-type","application/json");
  feinstaubRequest_sued.onreadystatechange=function(){update_feinstaub(this, "feinstaub-sued")};
  feinstaubRequest_sued.send();

  feinstaubRequest_nord = new XMLHttpRequest();
  feinstaubRequest_nord.open("GET", "http://api.dusti.xyz/v1/data/?sensor=63&page_size=1", true);
  feinstaubRequest_nord.setRequestHeader("Content-type","application/json");
  feinstaubRequest_nord.onreadystatechange=function(){update_feinstaub(this, "feinstaub-nord")};
  feinstaubRequest_nord.send();

}

function update_feinstaub(foo, inner_id){
  var feinstaub_html="";
  if(foo.readyState==4 && foo.status==200){
    response = JSON.parse(foo.responseText);
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
  document.getElementById(inner_id).innerHTML = feinstaub_html;
}


var spacesOpen = 0;
var spacesTotal = 0;

document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		requestPeopleInformation();
		requestMPDInformation();
		requestPowerInformation();
		requestKeyInformation();
		requestGelberSack();
		requestPapierMuell();
		requestRestMuell();
		requestHackerspaceInformation();
        requestIssues();
		requestFeinstaub();

		setInterval(function(){
			requestPeopleInformation();
			requestMPDInformation();
			requestPowerInformation();
			requestTempInformation();
			requestHumidityInformation();
			requestKeyInformation();
            requestFeinstaub();
		}, 10000);
	}
}
