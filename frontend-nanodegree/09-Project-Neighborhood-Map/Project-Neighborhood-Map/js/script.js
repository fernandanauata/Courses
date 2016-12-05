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
    data = {
      grant_type: "client_credentials",
      client_id: "b9Zej3614xnjJxr01JQFrQ",
      client_secret: "y7cxvKytUivAv2ZhwJkEZ476bwyf7kYNwqFGvSnvws7iv93bRBnu4uJKyxBpusGr"
    }
    var $post = $.ajax({
        type: "POST",
        url: "https://api.yelp.com/oauth2/token",
        data: data
    });

    console.log($post);
}
