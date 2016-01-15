function requestIssues(){
    var issuesRequest = new XMLHttpRequest();
    issuesRequest.open("GET", "https://api.github.com/repos/shackspace/spaceIssues/issues?state=open", true);
    issuesRequest.setRequestHeader("Content-type", "application/json");
    
    issuesRequest.onreadystatechange=function() {
        if(issuesRequest.readyState==4 && issuesRequest.status==200){
        	var issuetable = document.getElementById("issuetable")
            response = JSON.parse(issuesRequest.responseText);
            console.log(response)
            for(issue of response){
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				td.appendChild(document.createTextNode(issue.number + ": " +issue.title))
				tr.appendChild(td)
	            issuetable.appendChild(tr)
	            console.log(issuetable)
            }
        }
    }

    issuesRequest.send();
}

document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
        requestIssues();
	}
}
