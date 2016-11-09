$(function() {

    //Create the model
    var model = {

        currCat: null,
        cats: [{
            "id": "bunny",
            "alt": "Orange cat holding a bunny plush",
            "src": "img/bunny.jpg",
            "title": "Bunny",
            "counter": 0
        }, {
            "id": "doc",
            "alt": "Orange cat dressed as a doctor",
            "src": "img/doc.jpg",
            "title": "Doc",
            "counter": 0
        }, {
            "id": "eddie",
            "alt": "Grey cat with his tongue out",
            "src": "img/eddie.jpg",
            "title": "Eddie",
            "counter": 0
        }, {
            "id": "shay",
            "alt": "Grey cat looking adorable starring at camera",
            "src": "img/shay.jpg",
            "title": "Shay",
            "counter": 0
        }, {
            "id": "tiger",
            "alt": "Tiger cat sleeping on a white bed",
            "src": "img/tiger.jpg",
            "title": "Tiger",
            "counter": 0
        }]
    };


    //Create the interation within the octupus
    var octopus = {
        init: function() {

            // Listener for menu
            $("li").on("click", function(event) {
                var newId = event.target.id.split("_")[0];
                view.showCat(newId, model.currCat);
                model.currCat = newId;
            });

            // Listener for images
            $("img").on("click", function(event) {
                var id = event.target.id.split("_")[0];
                octopus.updateCounter(id);
            });

            //Listener for Admin button
            $(".adminButton").on("click", function(event) {
                $(".adminForm").show();
            });

            //Listener for Cancel button
            $(".cancel").on("click", function(event) {
                $(".adminForm").hide();
            });

            //Listener for Submit Button - changes currCat
            $(".submit").on("click", function(event) {
                model.cats.forEach(function(cat) {
                    if (model.currCat === cat.id) {
                        cat.title = $("#adminName").val();
                        cat.src = $("#adminURL").val();
                        cat.counter = parseInt($("#adminClicks").val());

                        view.render(cat);
                    }
                });
            });
        },

        getAllCats: function() {
            return model.cats;
        },

        //Make the counter work
        updateCounter: function(id) {
            model.cats.forEach(function(cat) {
                if (id === cat.id) {
                    cat.counter++;
                    view.showCounter(id, cat.counter);
                }
            });
        }
    };


    //Render on the page
    var view = {

        init: function() {

            // Add list
            octopus.getAllCats().forEach(function(cat) {
                var HTMLlist = '<li id="%id%" class="#">%data%</li>';
                $(".catlist").append(HTMLlist.replace("%id%", cat.id + "_item").replace("#", cat.id).replace("%data%", cat.title));
            });

            // Add cat containers
            octopus.getAllCats().forEach(function(cat) {
                var HTMLcontainer = '<nav id="#" class="catcontainer"></nav>';
                var HTMLimg = '<img id="%id%" class="img-responsive" alt="#" src="%data%">';
                var HTMLcounter = '<h2 id=%h2% >%data%: <span id="%id%" class="counter">' + cat.counter.toString() + '</span></h2>';

                $(".cat").append(HTMLcontainer.replace("#", cat.id));
                $(".catcontainer:last-child").append(HTMLimg.replace("%id%", cat.id + "_img").replace("#", cat.alt).replace("%data%", cat.src));
                $(".catcontainer:last-child").append(HTMLcounter.replace("%data%", cat.title).replace("%id%", cat.id + "_counter").replace("%h2%", cat.id + "_title"));
            });
            $(".catcontainer").hide();
            $(".adminForm").hide();
        },

        showCat: function(newId, prevId) {
            if (prevId != null) {
                $("#" + prevId).hide();
            }
            $("#" + newId).show();
        },
        showCounter: function(id, count) {
            $("#" + id + "_counter").text(count.toString());
        },

        //Add new cat created by the Admin form
        render: function(cat) {
          var HTMLcounter = '<h2>%data%: <span id="%id%" class="counter">' + cat.counter.toString() + '</span></h2>';

          $("#" + cat.id + "_img").attr("src", cat.src);
          $("#" + cat.id + "_title").replaceWith(HTMLcounter.replace("%data%", cat.title).replace("%id%", cat.id + "_counter"));
        },
    };

    view.init();
    octopus.init();
});
