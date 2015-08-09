function update(){
	var vvsRequest = new XMLHttpRequest();
	vvsRequest.open("GET", "https://efa-api.asw.io/api/v1/station/5000082/departures/", true);
	vvsRequest.setRequestHeader("Content-type","application/json");
	vvsRequest.onreadystatechange=function(){
		if(this.readyState==4 && this.status==200){
			var response = JSON.parse(this.responseText);
			vvs_directionHBF = [];
			vvs_directionUTH = [];
			// FIXME: get currentdate from request
			var currentdate = new Date();
			for(var key in response){
				if(response[key]["direction"] == "Untertürkheim" || response[key]["direction"] == "Hedelfingen"){
					vvs_directionUTH.push(response[key]);
				}
				else{
					vvs_directionHBF.push(response[key]);
				}
			}
			console.log(vvs_directionHBF);
			console.log(vvs_directionUTH);

			function fillTable(responseArray, table){
				var tableFill = document.getElementById(table);
				tableFill.innerHTML = ""; //Remove the previous table
				var count = 0;
				for(key in responseArray){
					console.log(responseArray[key]);
					departure = responseArray[key];
					var minutesLeft = 0;
					minutesLeft = (parseInt(departure.departureTime.year)*365*24*60)-(parseInt(currentdate.getFullYear())*365*24*60);  //Get the year
					minutesLeft = minutesLeft + (parseInt(departure.departureTime.month)*12*24*60)-((parseInt(currentdate.getMonth())+1)*12*24*60);  //Get the month
					minutesLeft = minutesLeft + (parseInt(departure.departureTime.day)*24*60)-(parseInt(currentdate.getDate())*24*60);  //Get the day
					// FIXME: fix for timezones. atm the offset is CST
					minutesLeft = minutesLeft + (parseInt(departure.departureTime.hour-1)*60)-(parseInt(currentdate.getHours())*60);  //Get the hour
					minutesLeft = minutesLeft + parseInt(departure.departureTime.minute)-parseInt(currentdate.getMinutes());  //Get the minute
					if(minutesLeft < 0){
						continue
					}
					if(count > 3){ // limit to 4 trains
						continue
					}
					var departureRow = tableFill.insertRow();
					var logoCell = departureRow.insertCell();
					logoCell.innerHTML = "<img src='./images_vvs/" + departure.number + ".png' style='width:100px;'></img>"; //Set logo
					logoCell.style.paddingRight = "20px";
					var destinationCell = departureRow.insertCell()
					destinationCell.innerHTML = departure.direction; //Set direction
					destinationCell.style.maxWidth = "450px"; //Break to long station names
					var minutesCell = departureRow.insertCell();
					minutesCell.innerHTML = minutesLeft + "min"; //Set time left
					(destinationCell.clientWidth > 400 ? minutesCell.style.paddingLeft = "30px" : minutesCell.style.paddingLeft = "100px"); //Make long station names readable
					if(minutesLeft < 4){
						minutesCell.style.color = "f00";
					}
					count += 1;
				}
				return count;
			}

			count = fillTable(vvs_directionHBF, "tableHBF");
			document.getElementById("tableHBF").style.top = 470-(55*count); //Adjust the anchor
			fillTable(vvs_directionUTH, "tableUTH");
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
