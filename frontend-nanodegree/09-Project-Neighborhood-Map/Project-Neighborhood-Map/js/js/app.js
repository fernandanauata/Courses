var initialCats = [{
    clickCount: 0,
    name: 'Bunny',
    imgSrc: 'img/bunny.jpg',
    imgAttribution: 'http://www.fondox.net/wallpapers/un-gato-bebe-433.jpg',
    nicknames: ['B', 'Bubu', 'Coelhinho']
}, {
    clickCount: 0,
    name: 'Doc',
    imgSrc: 'img/doc.jpg',
    imgAttribution: 'http://www.fondox.net/wallpapers/un-gato-bebe-433.jpg',
    nicknames: ['Doctor', 'CuteD']
}, {
    clickCount: 0,
    name: 'Eddie',
    imgSrc: 'img/eddie.jpg',
    imgAttribution: 'http://www.fondox.net/wallpapers/un-gato-bebe-433.jpg',
    nicknames: ['Eddy', 'Ed', 'Dy']
}, {
    clickCount: 0,
    name: 'Shay',
    imgSrc: 'img/shay.jpg',
    imgAttribution: 'http://www.fondox.net/wallpapers/un-gato-bebe-433.jpg',
    nicknames: ['Shayshay', 'Shy']
}, {
    clickCount: 0,
    name: 'Tiger',
    imgSrc: 'img/tiger.jpg',
    imgAttribution: 'http://www.fondox.net/wallpapers/un-gato-bebe-433.jpg',
    nicknames: ['Ty', 'Lion']
}];

var cat = function(data) {
    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
    this.imgSrc = ko.observable(data.imgSrc);
    this.imgAttribution = ko.observable(data.imgAttribution);
    this.nicknames = ko.observableArray(data.nicknames);
    this.title = ko.computed(function() {
        var title;
        var clicks = this.clickCount();
        if (clicks < 10) {
            title = 'Newborn';
        } else if (clicks < 50) {
            title = 'Infant';
        } else if (clicks < 100) {
            title = 'Child';
        } else if (clicks < 150) {
            title = 'Teen';
        } else if (clicks < 200) {
            title = 'Adult';
        } else if (clicks > 250) {
            title = 'Ninja';
        }
        return title;
    }, this);
};

var ViewModel = function() {
    var self = this;

    this.catList = ko.observableArray([]);

    initialCats.forEach(function(catItem) {
      self.catList.push(new cat(catItem));
    });

    this.currentCat = ko.observable( this.catList()[0] );

    this.incrementCounter = function() {
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };

    this.otherCat = function(catClicked) {
      self.currentCat(catClicked);
    }
};

ko.applyBindings(new ViewModel());
