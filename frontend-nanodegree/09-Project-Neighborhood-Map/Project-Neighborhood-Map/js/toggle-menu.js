$(function() {
  // Initalize sidebar
    var sidebar = $(".side-menu").sidebar({
        side: "left"
    });

    $(".menubutton").on('click', function() {
        sidebar.trigger("sidebar:toggle");
    });
});
