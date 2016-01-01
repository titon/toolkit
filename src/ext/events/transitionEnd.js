/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint callback-return: 0 */

import once from './once';

/**
 * Set a `transitionend` event. If the element has no transition set, trigger the callback immediately.
 *
 * @param {HTMLElement} element
 * @param {function} func
 * @returns {HTMLElement}
 */
export default function transitionEnd(element, func) {
    let duration = element.style.transitionDuration;

    // No transition defined so trigger callback immediately
    if (!duration || duration === '0s' || typeof duration === 'undefined') {
        func();

    // Bind a listener once
    } else {
        element.addEventListener('transitionend', once(func));
    }

    return element;
}
