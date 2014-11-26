# Toolkit - Unit Tests #

Running these unit tests will require jQuery, Mocha, Chai, and RequireJS to be installed, 
as well as Toolkit's CSS and JS files to be built.

1. Install the Node packages by running `npm install` from the project root.
2. Generate the Toolkit files by running `gulp`.
3. Open up `runner.html` in a browser to run the tests.
4. Profit.

## Testing from the command line ##

Tests can also be ran from the command line using PhantomJS. 
PhantomJS should be available if the NPM packages were installed above. To run the tests, simply call `gulp test`.

<div class="notice is-warning">
    This approach is merely a prototype and will still have assertions that fail compared to their browser counterpart.
</div>

## Tested browsers ##

The following browsers have been tested.

* Mac Chrome 38.0 - 100%
* Mac Firefox 33.1 - 100%
* Mac Safari 8.0 - 100%
* Windows Chrome 38.0 - 100%
* Windows Firefox 33.1 - 100%
* Windows Opera 25.0 - 100%
* Windows IE 11 - 100%
* Windows IE 10 - 100%
* Windows IE 9 - 99%
    * `transitionend()` won't work as IE9 doesn't support transitions.