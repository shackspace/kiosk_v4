document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		changePageTimer = window.setInterval(function(){document.location.href = "index.html"}, 2000);
	}
}
