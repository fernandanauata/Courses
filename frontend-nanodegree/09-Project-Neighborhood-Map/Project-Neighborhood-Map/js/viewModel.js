function ViewModel() {
    var self = this;

    //Initialize data
    self.translinkData = ko.observableArray();
    self.translinkName = ko.observableArray();
    self.weatherData = ko.observableArray();
    self.translinkNameAux = ko.observableArray();

    // Initialize infoWindow
    var infoWindow = new google.maps.InfoWindow();
    self.markers = [];

    //Define functions to get translink data
    self.getTranslinkData = function(map) {

        var vancouverStops = "https://neighborhoodmapproject.herokuapp.com/test.php";

        $.ajax({
                type: "POST",
                url: vancouverStops,
                data: {
                    latitude: 49.2827,
                    longitude: -123.1207
                },
                dataType: "json",
                success: function(content, textStatus, jqXHR) {
                    self.translinkData(content);

                    console.log(content);

                    //Get the stop names and add it on the `translinkName`
                    var stopNames = [];
                    content.forEach(function(item) {
                        stopNames.push(item.Name);
                    });
                    self.translinkName = ko.observableArray(stopNames);

                    //Add markers on the page
                    content.forEach(function(item) {

                        let stopName = item.Name;
                        let stopPosition = item.OnStreet;
                        let stopRoutes = item.Routes;

                        var infoWindowContent = `<div> <h5>${stopName}</h5> <p>At ${stopPosition}</p>  <p>Routes: ${stopRoutes}</p> </div>`;

                        var marker = new google.maps.Marker({
                            map: map,
                            icon: image,
                            animation: google.maps.Animation.DROP,
                            position: {
                                lat: parseFloat(item.Latitude),
                                lng: parseFloat(item.Longitude)
                            },
                            category: item.WheelchairAccess,
                            title: item.Name
                        });
                        marker.addListener('click', function() {
                            infoWindow.setContent(infoWindowContent);
                            infoWindow.open(map, marker);
                        });
                    self.markers.push(marker);
                    });
                }
            })
            .fail(function() {
                alert("error");
            });
    };

    //Define functions to get weather data
    self.getWeatherData = function(map) {

        var openweathermapURL = "http://api.openweathermap.org/data/2.5/weather?q=vancouver,ca&units=metric&id=524901&APPID=3fe2fae0071d0cbe47021bf06fb9a1af";

        var openWeather = $.ajax({
                type: "GET",
                url: openweathermapURL,
                data: null,
                dataType: "json",
                success: function(content, textStatus, jqXHR) {
                    self.weatherData(content);

                    //Gets the current weather
                    var currWeather = content.main.temp;
                    //Check the current weather and deliver a different message
                    if (currWeather < 0) {
                        $(".weather-check").text(`The Weather right now is ${currWeather}°C. Stay warm!`);
                    }
                    if (currWeather < -10) {
                        $(".weather-check").text(`The Weather right now is ${currWeather}°C. It's freazing!`);
                    }
                    if (currWeather > 0) {
                        $(".weather-check").text(`The Weather right now is ${currWeather}°C. Enjoy your day!`);
                    }
                }
            })
            .fail(function() {
                alert("error");
            });
    };

    self.checkValue = ko.observable(false);

    self.filterMarkers = function() {

      if (ko.toJSON(self.checkValue) === "true") {
          self.markers.forEach(function(marker){
            // Check if the bus stop is accessible
            if (marker.category > 0) {
              marker.setVisible(true);
            }
            else {
              marker.setVisible(false);
            }
          });
      }
      else {
        // If the check box is not check all bus stops markers are shown
        self.markers.forEach(function(marker){
          marker.setVisible(true);
        });
      }
      return true;
    }

}
