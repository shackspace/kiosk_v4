function say(event){
	gobbelz(event.innerHTML);
}

function gobbelz(text){
	var lightRequest = new XMLHttpRequest();
	lightRequest.open("POST", "http://gobbelz.shack/say/", true);
	lightRequest.setRequestHeader("Content-type","application/json");
	lightRequest.send(JSON.stringify({"text": text}));
}
