function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: -34.397, lng: 150.644}
  });
  var geocoder = new google.maps.Geocoder();
  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });
}
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      //TODO: Insert code here to take the first result's formatted address, and LOCATION.
      document.getElementById('firstComponent').innerHTML="The Formatted Address is: " + results[0].formatted_address; // PUT STUFF HERE
      document.getElementById('secondComponent').innerHTML="The Location is " + results[0].geometry.location;  //  PUT STUFF HERE
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
