var muell_url = "http://openhab.shack/muellshack/";
for (bid in {"gelber_sack":"","restmuell":"","papiermuell":""}){
  $( "#"+bid+"-img" ).on("click",function (){
      $.ajax({
        type: "POST",
        url: muell_url + bid,
        data: {"main_action_done":true} ,
        success: function (data) {
            alert("Thanks for making the shackspace a cleaner hackerspace")
        },
        dataType: "json"
      });
      $(this).css("visibility","hidden")
  });
}
