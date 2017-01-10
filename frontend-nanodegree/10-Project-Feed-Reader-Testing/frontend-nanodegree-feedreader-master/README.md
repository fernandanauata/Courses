# Project: Feed Reader Testing

This project was built using Javascript, jQuery, Jasmine (JavaScript Testing Framework). The main purpose of this project was to ensure all functionalities would work properly. Writing Jasmine on the `feedreader.js` I was able to test all the functions and what they return and be sure there were no bugs in the code.


## Open the Project

Clone this file on your local computer and open the `index.html` file on your browser. The testing was written on the `feedreader.js` you shall open this file in your code editor and play with it.


## Step by step

1. The first thing we have to ensure on an RSS website is that we are are getting the information we want from our source. We test if the information is defined and if it exists. 
2. We loop through all the information checking if there are a name and URL.
3. We want to have a toggle menu so we need to check if it works properly, the menu should not appear when the page is loaded, however, it should open and toggle back when the button is clicked.
4. We need to test if there is at least one link on the RSS feed page when the `loadFeed function` is called - this is an asynchronous function. To ensure it works we have to use Jasmine's `beforeEach` and asynchronous `done()` function.
5. The final step is to ensure that the information we need to be displayed is there. - we have to use an asynchronous call here as well.

## Sources

https://jasmine.github.io/2.4/introduction.html#section-Asynchronous_Support