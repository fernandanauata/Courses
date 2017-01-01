/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */
/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        /* Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('url defined', function() {
            // Loops through each feed in the allFeeds object
            allFeeds.forEach(function(data) {
                // Checks if the url is defined
                expect(data.url).toBeDefined();
                // The url should not be empty
                expect(data.url.length).not.toBe(0);
            });
        });

        /* Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('name defined', function() {
            allFeeds.forEach(function(data) {
                // Checks if the name is defined
                expect(data.name).toBeDefined();
                // The name should not be empty
                expect(data.name.length).not.toBe(0);
            });
        });
    });

    /* Write a new test suite named "The menu" */
    describe('The Menu', function() {
        /* Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('menu is hidden by default', function() {
            // Check if the menu is hidden by default
            expect($('body').hasClass('menu-hidden')).toBeTruthy();
        });

        /* Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it('menu changes visibility', function() {
            // Get the click on the menu icon
            $('.menu-icon-link').click();
            // The menu should toggle class
            expect($('body').hasClass('menu-hidden')).toBeFalsy();

            // Get the click on the menu icon
            $('.menu-icon-link').click();
            // The menu should toggle class
            expect($('body').hasClass('menu-hidden')).toBeTruthy();

        });
    });

    /* Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {
        /* Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */

        //asynchronous callback
        beforeEach(function(done) {
            loadFeed(0, done);
        });

        it("there's at least a single .entry element", function(done) {
            // Checks if the there's at least one .entry element
            expect($('.feed .entry').length).toBeGreaterThan(0);
            // invoke async callback
            done();
        });
    });

    /* Write a new test suite named "New Feed Selection"*/
    describe('New Feed Selection', function() {
        /* Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */

        var oldFeed;
        var newFeed;

        //asynchronous callback
        beforeEach(function(done) {
            loadFeed(0, function() {
                oldFeed = ($('.feed .entry').html());
                loadFeed(1, function() {
                    // The fuction should run after the new feed is loaded
                    newFeed = ($('.feed .entry').html());
                    done();
                });
            });
        });

        it('new feed loaded by the loadFeed', function(done) {
            // The Old Feed is not equal to the New Feed
            expect(oldFeed).not.toEqual(newFeed);
            // invoke async callback
            done();
        });
    });

}());