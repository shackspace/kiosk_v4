function requestCalender(){
	var calenderRequest = new XMLHttpRequest();
    calenderRequest.open("GET", "https://calendar.google.com/calendar/htmlembed?src=q4rffe7pskgkfc7sr3cmvcmavc@group.calendar.google.com&amp;ctz=Europe/Berlin&mode=AGENDA", true);
    calenderRequest.setRequestHeader("Content-type", "application/json");
    
    calenderRequest.onreadystatechange=function() {
        if(calenderRequest.readyState==4 && calenderRequest.status==200){
            var calender = document.createElement('html');
			calender.innerHTML = calenderRequest.responseText;
			var events = calender.getElementsByClassName("date-section");
			console.log(events)
			var eventtable = document.getElementById("eventtable");
			for(var i = 0; i<6; i++){
				var lines = events[i].innerText.split("\n");
				console.log(lines);

				//Append the date
				var tr = document.createElement("tr");
				var td = document.createElement("td");
				td.appendChild(document.createTextNode(lines[0]));
				tr.appendChild(td);
				eventtable.appendChild(tr)


				//Get the events right -> Its a shit parser, but it works
				var eventlines = [];
				for(var j = 1; j<(lines.length-1); j++){
					var splitstring = lines[j].split(" "); 
					var eventtime = splitstring[splitstring.length-1];
					console.log(eventtime);
					
					splitstring = lines[j+1].split(" ");
					if(j != lines.length-2){
						var eventname = splitstring.slice(0, -1).join(" ");
					}
					else{
						var eventname = splitstring.join(" ");
					}
					console.log(eventname);
					eventlines.push(eventtime + " " + eventname);
				}
				
				//Append all the events
				for(eventline of eventlines){
					var tr = document.createElement("tr");
					var td = document.createElement("td");
					td.style.color = "#099";
					td.appendChild(document.createTextNode(eventline));
					tr.appendChild(td);
					eventtable.appendChild(tr)
				}						
			}
        }
    }

    calenderRequest.send();
}

function requestIssues(){
    var issuesRequest = new XMLHttpRequest();
    issuesRequest.open("GET", "https://api.github.com/repos/shackspace/spaceIssues/issues?state=open", true);
    issuesRequest.setRequestHeader("Content-type", "application/json");
    
    issuesRequest.onreadystatechange=function() {
        if(issuesRequest.readyState==4 && issuesRequest.status==200){
        	var issuetable = document.getElementById("issuetable");
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
		requestCalender();
	}
}
