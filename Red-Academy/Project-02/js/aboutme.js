$(function () { // wait for document ready
    // Init
    var controller = new ScrollMagic.Controller();

    var tween = new TimelineMax ()
    .add([
      TweenMax.to(".aboutme-right-container", 1, {y: "-500vh"})
    ]);

    // build scene
    var scene = new ScrollMagic.Scene({triggerElement: ".aboutme", duration: 2000, triggerHook: "onLeave"})
            .setTween(tween)
            .setPin(".aboutme")
            .addIndicators() // add indicators (requires plugin)
            .addTo(controller);
  });
