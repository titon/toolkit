/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint no-var: 0 */

/**
 * Wrap a function that will only be triggered once when set as an event listener.
 *
 * @param {Function} func
 * @returns {Function}
 */
export default function once(func) {
    var listener = function(event) {
        event.target.removeEventListener(event.type, listener);

        func(event);
    };

    return listener;
}
