var map;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });

  // Creates a new marker
  var tribeca = {lat: 40.719526, lng: -74.0089934};
  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'First Marker!'
  });

  // Creates a info window that popups when the marker is clicked
  var infowindow = new google.maps.InfoWindow({
    content: 'Do you ever feel like an InfoWindow, floating through the wind, ready to start again?'
  });

  marker.addListener('click', function(){
    infowindow.open(map, marker);
  });
}
