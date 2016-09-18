var sayTimer;
var progressInterval;

function say(event){
	s = document.getElementById("sentence")
	if (event.innerHTML == "SPACE"){s.innerHTML = s.innerHTML + " ";}
	else if(event.innerHTML == "BACKSPACE"){s.innerHTML = s.innerHTML.substring(0, s.innerHTML.length-1);}
	else {s.innerHTML = s.innerHTML + event.innerHTML;}

	clearTimeout(sayTimer);

	clearInterval(progressInterval)
	document.getElementById("timeleft").value = "100"; //Reset the countdown

	progressInterval = setInterval(function(){
		countdown = document.getElementById("timeleft");
		if(countdown.value == 5){
			countdown.value = 100;		
		}
		else{
			countdown.value = countdown.value - 5
		}
	}, 99);

	sayTimer = setTimeout(function(){
		clearInterval(progressInterval); //Remove the countdown interval
		s = document.getElementById("sentence"); //Remove the said sentence		
		gobbelz(s.innerHTML)
		s.innerHTML = ""
	}, 2100);
}

function gobbelz(text){
	var lightRequest = new XMLHttpRequest();
	lightRequest.open("POST", "http://gobbelz.shack/say/", true);
	lightRequest.setRequestHeader("Content-type","application/json");
	lightRequest.send(JSON.stringify({"text": text}));
}

var psi = false;
function startPsi(value){
	console.log(value)
	if(value > 70 && psi==false){
		psi = true;
		console.log("Playing PSI sound")
		new Audio('./psi_alarm.mp3').play(); //Play sound
	}
}

var attila = false;
function startAttila(value){
	console.log(value)
	if(value > 70 && attila==false){
		attila = true;
		console.log("Playing Attila sound")
		new Audio('./Attila.mp3').play(); //Play sound
	}
}
