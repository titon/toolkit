/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint callback-return: 0 */

import once from './once';

export const EVENT_NAME = (() => {
    let prefixes = 'transition WebkitTransition MozTransition OTransition msTransition'.split(' '),
        prefix = 'transition',
        style = document.createElement('div').style,
        map = {
            WebkitTransition: 'webkitTransitionEnd',
            OTransition: 'oTransitionEnd otransitionend'
        };

    for (let i = 0; i < prefixes.length; i++) {
        if (prefixes[i] in style) {
            prefix = prefixes[i];
            break;
        }
    }

    return map[prefix] || 'transitionend';
})();

/**
 * Set a `transitionend` event. If the element has no transition set, trigger the callback immediately.
 *
 * @param {HTMLElement} element
 * @param {Function} func
 * @returns {HTMLElement}
 */
export default function transitionEnd(element, func) {
    let duration = element.style.transitionDuration;

    // No transition defined so trigger callback immediately
    if (!duration || duration === '0s' || typeof duration === 'undefined') {
        func();

    // Bind a listener once
    } else {
        element.addEventListener(EVENT_NAME, once(func));
    }

    return element;
}
