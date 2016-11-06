//First Cat

//Add Cat Name
var firstcat = '<h1> Meow </h1>';
$('.firstcat').prepend(firstcat);

//Count the clicks for the first cats
$('#firstcat').click(function(e) {
  var counterStr = $('#counter').html();
  var counter = parseInt(counterStr) + 1;

  $('#counter').text(counter.toString());
});

//Second Cat

//Add Cat Name
var secondcat = '<h1> Fluffy </h1>';
$('.secondcat').prepend(secondcat);

//Count the clicks for the second cat
$('#secondcat').click(function(e) {
  var counterStr = $('#counter2').html();
  var counter = parseInt(counterStr) + 1;

  $('#counter2').text(counter.toString());
});
