/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

/**
 * TODO
 *
 * @param {string} selector
 * @param {function} func
 * @returns {function}
 */
export function delegate(selector, func) {
    return function() {};
}

/**
 * Set a `transitionend` event. If the element has no transition set, trigger the callback immediately.
 *
 * @param {HTMLElement} element
 * @param {function} func
 * @returns {HTMLElement}
 */
export function transitionEnd(element, func) {
    var event = 'transitionend',
        duration = element.style.transitionDuration;

    element.addEventListener(event, func);

    // No transition defined so trigger callback immediately
    if (duration === '0s' || typeof duration === 'undefined') {
        element.dispatchEvent(new TransitionEvent(event));
        element.removeEventListener(event, func);
    }

    return element;
}
