var map;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 49.2827,
            lng: -123.1207
        },
        zoom: 17,
        mapTypeControl: false
    });

    var success = function(response) {
        console.log(response);
    }

    // Open Weather Map Ajax request
    const $post = $.ajax({
        type: "POST",
        url: "http://api.openweathermap.org/data/2.5/weather?q=vancouver,ca&units=metric&id=524901&APPID=3fe2fae0071d0cbe47021bf06fb9a1af",
        data: null,
        success: success,
        dataType: "json"
    }).done(function(data) {
        let currWeather = data.main.temp;
        $(".title").text(`The temperature is ${currWeather} °C`);
    });

    // Translink API AJAX request
    var vancouverStops = "https://neighborhoodmapproject.herokuapp.com/test.php";

    $.ajax({
            type: "POST",
            url: vancouverStops,
            data: {
                latitude: 49.2827,
                longitude: -123.1207
            },
            dataType: "json"
        })
        .done(function(data) {
            data.forEach(function(item) {
              console.log(item);
              var marker = new google.maps.Marker({
                  map: map,
                  animation: google.maps.Animation.DROP,
                  position: {lat: parseFloat(item.Latitude), lng: parseFloat(item.Longitude)},
                  title: item.Name
              });
              // marker.setMap(map);
            });
            // var myLatlng = new google.maps.LatLng(latitude,longitude);
            //
            // var marker = new google.maps.Marker({
            //     position: myLatlng,
            //     title: "Hello World!"
            // });
        })
        .fail(function( ) {
            alert("error");
        });
}
