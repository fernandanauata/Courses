var container = '<nav id="#" class="container"></nav>';
var HTMLimg = '<img class="img-responsive" alt="#" src="%data%">';
var HTMLcounter = '<h2>%data%: <span id="counter">0</span></h2>';

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
  var test = cat.catsattr.length;
  if (cat.catsattr.length > 0) {

      cat.catsattr.forEach(function(cat){
        $(".cat").append(container.replace("#", cat.id));
        $(".container:last-child").append(HTMLimg.replace("#", cat.alt).replace("%data%", cat.src));
        $(".container:last-child").append(HTMLcounter.replace("%data%", cat.title));
      });

  };
};

cat.display();

// //Count the clicks for the first cats
// $('.cat').click(function(e) {
//   var counterStr = $('#counter').html();
//   var counter = parseInt(counterStr) + 1;
//
//   $('#counter').text(counter.toString());
// });
//
// //Second Cat
//
// //Add Cat Name
// var secondcat = '<h2> Fluffy </h2>';
// $('.secondcat').prepend(secondcat);
//
// //Count the clicks for the second cat
// $('#secondcat').click(function(e) {
//   var counterStr = $('#counter2').html();
//   var counter = parseInt(counterStr) + 1;
//
//   $('#counter2').text(counter.toString());
// });
