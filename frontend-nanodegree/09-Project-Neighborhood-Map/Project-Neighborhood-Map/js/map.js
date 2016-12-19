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

    //Instanciate viewModel object
    var viewModel = new ViewModel(map);

    //Apply bindings to viewModel
    ko.applyBindings(viewModel);

    //Retreive data
    viewModel.getTranslinkData();
    viewModel.getWeatherData();
}
/**
 * Error callback for GMap API request
 */
mapError = function() {
  alert("Google Map is not working!");
};
