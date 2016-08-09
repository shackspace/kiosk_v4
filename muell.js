var muell_url = "http://openhab.shack/muellshack/";
var last_bid = false

$("#ok-button").click(function (){
  $.ajax({
    type: "POST",
    url: muell_url + last_bid,
    data: JSON.stringify({"main_action_done":true}) ,
    success: function (data) {
        $("#"+last_bid+"-text").css("visibility","hidden")
        $("#"+last_bid+"-img").css("visibility","hidden")
  	$("#last-checkpoint").css("visibility","hidden")
        alert("Danke, du bist super!")
    },
    failure: function (data) {
	alert("Etwas ist schief gelaufen: "  +data +"\nKontaktiere doch bitte Ulrich. Thx" )
    },
    contentType: "application/json; charset=UTF-8",
    dataType: "json"
  });
});

$("#nok-button").click(function (){
  alert("Kann ja mal passieren, kein Problem :)")
  $("#last-checkpoint").css("visibility","hidden")
});

for (bid in {"gelber_sack":"","restmuell":"","papiermuell":""}){
  $( "#"+bid+"-img" ).click({bid: bid},function (event){
      last_bid = event.data.bid // set global variable
      $("#last-checkpoint").css("visibility","visible")
      
  });
}
