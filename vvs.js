function update(){
	var vvsRequest = new XMLHttpRequest();
	vvsRequest.open("GET", "http://kiosk.shack:8081/station/5000082", true);
	vvsRequest.setRequestHeader("Content-type","application/json");
	vvsRequest.onreadystatechange=function(){
		if(this.readyState==4 && this.status==200){
			response = JSON.parse(this.responseText);
			if(response.status == "success"){
				var vvs_directionHBF = [];
				var vvs_directionUTH = [];
				for(key in response.departures){
					if(response.departures[key]["direction"].substr(0,6) == "Untertürkheim".substr(0,6) || response.departures[key]["direction"] == "Hedelfingen"){
						vvs_directionUTH.push(response.departures[key]);
					}
					else{
						vvs_directionHBF.push(response.departures[key]);
					}
				}
				console.log(vvs_directionHBF);
				console.log(vvs_directionUTH);
				
				function fillTable(responseArray, table){
					var tableFill = document.getElementById(table);
					tableFill.innerHTML = ""; //Remove the previous table
					for(departure in responseArray){
						departure = responseArray[departure]; //Get the departure object
						var departureRow = tableFill.insertRow();
						var logoCell = departureRow.insertCell();
						logoCell.innerHTML = "<img src='./images_vvs/" + departure.symbol + ".png' style='width:100px;'></img>"; //Set logo
						logoCell.style.paddingRight = "20px";
						var destinationCell = departureRow.insertCell()
						destinationCell.innerHTML = departure.direction; //Set direction
						destinationCell.style.maxWidth="400px";
						var minutesLeft = 0;
						minutesLeft = (parseInt(departure.departureTime.substr(0, 4))*365*24*60)-(parseInt(response.requestTime.substr(0,4))*365*24*60);  //Get the year
						minutesLeft = minutesLeft + (parseInt(departure.departureTime.substr(4, 2))*12*24*60)-(parseInt(response.requestTime.substr(4,2))*12*24*60);  //Get the month
						minutesLeft = minutesLeft + (parseInt(departure.departureTime.substr(6, 2))*24*60)-(parseInt(response.requestTime.substr(6,2))*24*60);  //Get the day
						minutesLeft = minutesLeft + (parseInt(departure.departureTime.substr(8, 2))*60)-(parseInt(response.requestTime.substr(8,2))*60);  //Get the hour
						minutesLeft = minutesLeft + parseInt(departure.departureTime.substr(10, 2))-parseInt(response.requestTime.substr(10,2));  //Get the minute
						var minutesCell = departureRow.insertCell();
						minutesCell.innerHTML = minutesLeft + "min"; //Set time left
						minutesCell.style.paddingLeft = "100px";
						if(minutesLeft < 4){
							minutesCell.style.color = "f00";
						}
					}
				}

				fillTable(vvs_directionHBF, "tableHBF");
				document.getElementById("tableHBF").style.top = 470-(55*vvs_directionHBF.length); //Adjust the anchor
				fillTable(vvs_directionUTH, "tableUTH");
			}
		}
	}
	vvsRequest.send(); //Start the request we just added
}
document.onreadystatechange = function() {
	var state = document.readyState;
	if(state == 'complete') {
		update();
		window.setInterval(function(){update()}, 10000);
	}
}
