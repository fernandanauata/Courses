var HTMLlist = '<li class="#" onclick="%function%">%data%</li>';

function visible(id){
    $(".catcontainer").hide();
    $("#" + id).show();
};

function counter(id){
    var counterStr = $('#' + id + "_counter").html();
    var counter = parseInt(counterStr) + 1;
    $('#' + id + "_counter").text(counter.toString());
}

var HTMLcontainer = '<nav id="#" class="catcontainer"></nav>';
var HTMLimg = '<img class="img-responsive" alt="#" onclick="%function%" src="%data%">';
var HTMLcounter = '<h2>%data%: <span id="%id%" class="counter">0</span></h2>';

var cat = {
  "catsattr": [{
    "id": "bunny",
    "alt": "Orange cat holding a bunny plush",
    "src": "img/bunny.jpg",
    "title": "Bunny",
  }, {
    "id": "doc",
    "alt": "Orange cat dressed as a doctor",
    "src": "img/doc.jpg",
    "title": "Doc",
  }, {
    "id": "eddie",
    "alt": "Grey cat with his tongue out",
    "src": "img/eddie.jpg",
    "title": "Eddie",
  },
  {
    "id": "shay",
    "alt": "Grey cat looking adorable starring at camera",
    "src": "img/shay.jpg",
    "title": "Shay",
  }, {
    "id": "tiger",
    "alt": "Tiger cat sleeping on a white bed",
    "src": "img/tiger.jpg",
    "title": "Tiger",
  }]
};

cat.display = function() {
  if (cat.catsattr.length > 0) {

      cat.catsattr.forEach(function(cat){
        $(".catlist").append(HTMLlist.replace("#", cat.id).replace("%data%", cat.title).replace("%function%", "visible('" + cat.id +"')"));
        $(".cat").append(HTMLcontainer.replace("#", cat.id));
        $(".catcontainer:last-child").append(HTMLimg.replace("#", cat.alt).replace("%data%", cat.src).replace("%function%", "counter('" + cat.id + "')"));
        $(".catcontainer:last-child").append(HTMLcounter.replace("%data%", cat.title).replace("%id%", cat.id + "_counter"));
      });
      $(".catcontainer").hide();
  }
};

cat.display();
