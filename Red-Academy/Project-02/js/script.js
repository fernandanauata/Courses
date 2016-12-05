$(function() {
    //Check the window width
    var width = $(window).width()
        //Check the window height
    height = $(window).height();

    // Initalize sidebar
    var sidebar = $(".sidebar-menu").sidebar({
        side: "left"
    });

    $(".linesbutton").on('click', function() {
        sidebar.trigger("sidebar:toggle");
    });

    //Smal Portfolio Carousel
    $('.carousel').slick({
        autoplay: true,
        arrows: false
    });



});
