var isMobile = function() {
    var isMobile = false; //initiate as false
    // device detection
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) isMobile = true;
    return isMobile;
}


$(function() { // wait for document ready

    // don't use this function for mobile
    if (isMobile() === false) {
        // Init
        var controller = new ScrollMagic.Controller();

        // define movement of panels
        var wipeAnimation = new TimelineMax()
            // animate to second panel
            .to("#slideContainer", 0.5, {
                z: 0
            }) // move back in 3D space
            .to("#slideContainer", 1, {
                x: "-25%"
            }) // move in to first panel
            .to("#slideContainer", 0.5, {
                z: 0
            }) // move back to origin in 3D space
            // animate to third panel
            .to("#slideContainer", 0.5, {
                z: 0,
                delay: 1
            })
            .to("#slideContainer", 1, {
                x: "-50%"
            })
            .to("#slideContainer", 0.5, {
                z: 0
            })
            // animate to forth panel
            .to("#slideContainer", 0.5, {
                z: 0,
                delay: 1
            })
            .to("#slideContainer", 1, {
                x: "-75%"
            })
            .to("#slideContainer", 0.5, {
                z: 0
            });

        // create scene to pin and link animation
        var scene = new ScrollMagic.Scene({
                triggerElement: "#pinContainer",
                triggerHook: "onLeave",
                duration: "500%"
            })
            .setPin("#pinContainer")
            .setTween(wipeAnimation)
            //.addIndicators() // add indicators (requires plugin)
            .addTo(controller);

    }
});
