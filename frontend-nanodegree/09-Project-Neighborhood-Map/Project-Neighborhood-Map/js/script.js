var map;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 49.2827,
            lng: -123.1207
        },
        zoom: 13,
        mapTypeControl: false
    });

    var success = function(response){
      console.log(response);
    }

    const $post = $.ajax({
      type: "POST",
      url: "http://api.openweathermap.org/data/2.5/weather?q=vancouver,ca&units=metric&id=524901&APPID=3fe2fae0071d0cbe47021bf06fb9a1af",
      data: null,
      success: success,
      dataType: "json"
    }).done(function(data) {
      let currWeather = data.main.temp;
      $(".title").text(`The temperature is ${currWeather} °C`);
   });;






}
