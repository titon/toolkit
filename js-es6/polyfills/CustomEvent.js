/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

try {
    // IE has the `CustomEvent` class defined, but you can't actually use it.
    // It will throw an "Object doesn't support this action" error.
    var testForEvent = new CustomEvent('test');

} catch(e) {

    // Cheers to the MDN team for the polyfill.
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    window.CustomEvent = function(event, params) {
        params = params || {}; // Chrome will error if we use argument defaults

        var object = document.createEvent('CustomEvent');
            object.initCustomEvent(event, params.bubbles || false, params.cancelable || false, params.detail || {});

        return object;
    };

    window.CustomEvent.prototype = window.Event.prototype;
}
