$(function() {
    //Check the window width
    var width = $(window).width();
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
      arrows: false,
        autoplay: true,
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        responsive: [{
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 3
            }
        }, {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
        }]
    });
});
