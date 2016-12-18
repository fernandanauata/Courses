function ViewModel(map) {
    var self = this;
    self.map = map;
    //Initialize data
    self.translinkData = ko.observableArray();
    self.translinkName = ko.observableArray();
    self.weatherData = ko.observableArray();
    self.translinkNameAux = ko.observableArray();

    self.selectedItems = ko.observableArray();

    self.weatherMessage = ko.observable();

    // Initialize infoWindow
    var infoWindow = new google.maps.InfoWindow();
    self.markers = [];
    self.infoWindowContents = [];

    //Define functions to get translink data
    self.getTranslinkData = function() {

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
                    //Get the stop names and add it on the `translinkName`
                    var stopNames = [];
                    content.forEach(function(item) {
                        stopNames.push(item.Name);
                    });
                    self.translinkNameAux(stopNames);

                    //Add markers on the page
                    content.forEach(function(item) {

                        let stopName = item.Name;
                        let stopPosition = item.OnStreet;
                        let stopRoutes = item.Routes;

                        var infoWindowContent = `<div> <h5>${stopName}</h5> <p>At ${stopPosition}</p>  <p>Routes: ${stopRoutes}</p> </div>`;

                        var marker = new google.maps.Marker({
                            map: self.map,
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
                            marker.setAnimation(google.maps.Animation.BOUNCE);
                            window.setTimeout(
                                function() {
                                    marker.setAnimation(null);
                                },
                                2000
                            );
                            infoWindow.setContent(infoWindowContent);
                            infoWindow.open(map, marker);
                            self.selectedItems([item.Name]);
                            map.setCenter({lat: item.Latitude, lng: item.Longitude});
                            map.setZoom(18);
                        });
                        self.infoWindowContents.push({
                          "position": {lat: item.Latitude, lng: item.Longitude},
                          "title": item.Name,
                          "infoWindowContent": infoWindowContent});
                        self.markers.push(marker);
                    });

                }
            })
            .fail(function() {
                alert("error");
            });
    };

    //Define functions to get weather data
    self.getWeatherData = function() {

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
                    var message = "";
                    //Check the current weather and deliver a different message
                    if (currWeather < 0) {
                        message = `The Weather right now is ${currWeather}°C. Stay warm!`;
                    }
                    if (currWeather < -10) {
                        message = `The Weather right now is ${currWeather}°C. It's freazing!`;
                    }
                    if (currWeather > 0) {
                        message = `The Weather right now is ${currWeather}°C. Enjoy your day!`;
                    }
                    self.weatherMessage(message);
                }
            })
            .fail(function() {
                alert("error");
            });
    };


    // The menu doesn't start visible
    self.menuVisible = ko.observable(false);
    // Initalize sidebar
    var sidebar = $(".side-menu").sidebar({
        side: "left"
    });
    // Toggle sidebar
    self.toggleMenu = function() {
        sidebar.trigger("sidebar:toggle");
        return true;
    };

    // Uncheck the checkbox
    self.checkValue = ko.observable(false);

    self.filterMarkers = function() {
        var filteredNameList = [];
        var jsonTranslinkData = JSON.parse(ko.toJSON(self.translinkData));

        if (ko.toJSON(self.checkValue) === "true") {
            self.markers.forEach(function(marker) {
                // Check if the bus stop is accessible
                if (marker.category > 0) {
                    marker.setVisible(true);
                } else {
                    marker.setVisible(false);
                }
            });
            jsonTranslinkData.forEach(function(item) {
                if (item.WheelchairAccess > 0) {
                    filteredNameList.push(item.Name);
                }
            });
        } else {
            // If the check box is not check all bus stops markers are shown
            self.markers.forEach(function(marker) {
                marker.setVisible(true);
            });

            jsonTranslinkData.forEach(function(item) {
                filteredNameList.push(item.Name);
            });
        }
        self.translinkNameAux(filteredNameList);
        return true;
    };

    self.selectItemFromList = function() {
        var selected = JSON.parse(ko.toJSON(self.selectedItems))[0];
        self.markers.forEach(function(marker) {
            if (selected === marker.title) {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                window.setTimeout(
                    function() {
                        marker.setAnimation(null);
                    },
                    2000
                );

                self.infoWindowContents.forEach(function(e){
                  if (e.title === selected){
                    infoWindow.setContent(e.infoWindowContent);
                    self.map.setCenter(e.position);
                    self.map.setZoom(18);
                  }
                });
                infoWindow.open(map, marker);
            }
        });
        //self.selectedItems(selected);


        return true;
    };
}
