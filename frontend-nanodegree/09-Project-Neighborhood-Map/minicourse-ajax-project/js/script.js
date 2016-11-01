function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $("#street").val();
    var city = $("#city").val();

    $greeting.text('So, you want to live at' + ' ' + street + ', ' + city + '?');

    $body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + street + city + '">');

    // NYTimes AJAX request
    var NYTurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&sort=newest&api-key=2ffecce280f84249bdb5d486b2dd33eb";

    $.getJSON(NYTurl, function(data) {
        var docs = data.response.docs;

        console.log(data);

        $nytHeaderElem.text('New York Times Articles About ' + city);

        for (var i = 0; i < docs.length; i++) {
            var NYTarticles = docs[i];

            $('#nytimes-articles').append('<li class="article"' + '<a ' + 'href="' + docs[i].web_url + '">' + docs[i].headline.main + '</a>' + '<p>' + docs[i].snippet + '</p>' + '</li>');
        }
    }).error(function(e) {
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });

    // Wikipedia AJAX
    var WikiURl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallback";

    $.ajax({
        url: WikiURl,

        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // Work with the response
        success: function(response) {
            console.log(response); // server response
            var wikiArticles = response[1];

            for (var i = 0; i < wikiArticles.length; i++) {
              var article = wikiArticles[i];

              $('#wikipedia-links').append('<li>' + '<a ' + 'href="' + 'https://www.wikipedia.org/wiki/' + article + '">' + article + '</a>' + '</li>');
            }
        }
    });
    return false;
}

$('#form-container').submit(loadData);
