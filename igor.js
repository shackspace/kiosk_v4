var sayTimer;
var progressInterval;

function say(event){
	s = document.getElementById("sentence") 
	s.innerHTML = s.innerHTML + " " + event.innerHTML;
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
	}, 100);

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
