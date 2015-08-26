/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Swipe from 'events/Swipe';

const swipeListenerMap = new WeakMap();

/**
 * Bind swipe event listeners to the element if it does not have them already.
 * Return the original handler so that it may be called later on.
 *
 * @param {HTMLElement} element
 * @param {function} func
 * @param {object} options
 * @returns {function}
 */
export default function swipe(element, func, options = {}) {
    if (swipeListenerMap.has(element)) {
        swipeListenerMap.get(element).disable(); // Unbind events
        swipeListenerMap.delete(element);

    } else {
        swipeListenerMap.set(element, new Swipe(element, options));
    }

    return func;
}
