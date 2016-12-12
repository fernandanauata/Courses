var map;
var image = 'https://neighborhoodmapproject.herokuapp.com/bus-icon.png';

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

                let stopName = item.Name;
                let stopPosition = item.OnStreet;
                let stopRoutes = item.Routes;

                var infoWindowContent = `<div> <h5>${stopName}</h5> <p>At ${stopPosition}</p>  <p>Routes: ${stopRoutes}</p> </div>`;

                var infoWindow = new google.maps.InfoWindow({
                    content: infoWindowContent
                });

                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    animation: google.maps.Animation.DROP,
                    position: {
                        lat: parseFloat(item.Latitude),
                        lng: parseFloat(item.Longitude)
                    },
                    title: item.Name
                });
                marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                });

            });
        })
        .fail(function() {
            alert("error");
        });
}
