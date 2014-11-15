/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    './transition'
], function(hasTransition) {

// Store the event name in a variable
var transitionEnd = (function() {
    var eventMap = {
        WebkitTransition: 'webkitTransitionEnd',
        OTransition: 'oTransitionEnd otransitionend'
    };

    return eventMap[hasTransition] || 'transitionend';
})();

return transitionEnd;
});