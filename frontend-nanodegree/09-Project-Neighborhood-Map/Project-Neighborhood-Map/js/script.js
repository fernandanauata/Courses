var map;
var image = 'https://neighborhoodmapproject.herokuapp.com/bus-icon.png';

var initMap = function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 49.2827,
            lng: -123.1207
        },
        zoom: 17,
        mapTypeControl: false
    });

    // Translink API AJAX request
    var vancouverStops = "https://neighborhoodmapproject.herokuapp.com/test.php";

    this.translinkResults = ko.observable();

    ko.computed(function() {
        // Whenever "pageIndex", "sortColumn", or "sortDirection" change, this function will re-run and issue
        // an Ajax request. When the Ajax request completes, assign the resulting value to "queryResults"
        $.ajax({
                type: "POST",
                url: vancouverStops,
                data: {
                    latitude: 49.2827,
                    longitude: -123.1207
                },
                dataType: "json",
                success: this.translinkResults
            })
            .done(function(data) {
                data.forEach(function(item) {

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
    }, this);



};



var dataAPI = {
    weatherData: (function() {
        var success = function(response) {}
            // Open Weather Map Ajax request
        var openweathermapURL = "http://api.openweathermap.org/data/2.5/weather?q=vancouver,ca&units=metric&id=524901&APPID=3fe2fae0071d0cbe47021bf06fb9a1af"

        var openWeather = $.ajax({
            type: "POST",
            url: openweathermapURL,
            data: null,
            success: success,
            dataType: "json"
        }).done(function(data) {
            jsonWeather = data;
        });
        return success;
    })()
}

console.log(initMap.translinkResults);

var ViewModel = function() {
    var self = this;
    self.stops = ko.observableArray(['London', 'Paris', 'Tokyo']);

    // The current item will be passed as the first parameter, so we know which place to remove
    self.listBusStop = function(place) {
        self.stops.remove(place);

    };

    console.log(dataAPI.weatherData);
}

ko.applyBindings(new initMap());
