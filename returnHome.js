document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		document.getElementById("homeButton").onclick = function(){
			window.location.href = "./index.html";
		}
	}
}
