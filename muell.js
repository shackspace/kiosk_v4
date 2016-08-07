var muell_url = "http://openhab.shack/muellshack/";
for (bid in {"gelber_sack":"","restmuell":"","papiermuell":""}){
  $( "#"+bid+"-img" ).click({url: muell_url + bid},function (event){
      $.ajax({
        type: "POST",
        url: event.data.url,
        data: JSON.stringify({"main_action_done":true}) ,
        success: function (data) {
            alert("Thanks for making the shackspace a cleaner hackerspace")
        },
        contentType: "application/json; charset=UTF-8",
        dataType: "json"
      });
      $(this).css("visibility","hidden")
  });
}
