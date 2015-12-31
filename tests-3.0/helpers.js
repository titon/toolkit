/*eslint no-unused-vars: 0*/

'use strict';

/**
 * Convert `console.warn()` calls to errors so that we can unit test properly.
 */
var oldWarn = console.warn;

console.warn = function(message) {
    throw new Error(message);
};

/**
 * Process a callback in a separate thread so that mutations trigger instantly,
 * instead of waiting for the render loop.
 *
 * @param {function} func
 */
function processInThread(func) {
    setTimeout(func, 0);
}
