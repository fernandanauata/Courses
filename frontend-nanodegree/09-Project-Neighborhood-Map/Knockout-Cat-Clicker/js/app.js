var ViewModel = function() {
    this.clickCount = ko.observable(0);
    this.name = ko.observable('Tabby');
    this.imgSrc = ko.observable('img/22252709_010df3379e_z.jpg');
    this.imgAttribution = ko.observable('http://www.fondox.net/wallpapers/un-gato-bebe-433.jpg');

    this.incrementCounter = function() {
        this.clickCount(this.clickCount() + 1);
    };

    this.nicknames = ko.observable(
        [{
            nickname: 'Tabtab'
        }, {
            nickname: 'T-Bone'
        }, {
            nickname: 'Mr. T'
        }, {
            nickname: 'Tabitha'
        }]
    )
};

ko.applyBindings(new ViewModel());
