/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import '../polyfills/element/matches';

/**
 * Wrap a function that delegates the execution until the target element matches a selector.
 *
 * @param {string} selector
 * @param {function} func
 * @returns {function}
 */
export function delegate(selector, func) {
    return function(event) {
        let target = event.target;

        while (target && target !== document) {
            if (target.matches(selector)) {
                event.delegatedTarget = target;
                func(event);
                break;
            }

            target = target.parentNode;
        }
    };
}

/**
 * Wrap a function that will only be triggered once when set as an event listener.
 *
 * @param {function} func
 * @returns {function}
 */
export function once(func) {
    var listener = function(event) {
        event.target.removeEventListener(event.type, listener);

        func(event);
    };

    return listener;
}

/**
 * Set a `transitionend` event. If the element has no transition set, trigger the callback immediately.
 *
 * @param {HTMLElement} element
 * @param {function} func
 * @returns {HTMLElement}
 */
export function transitionEnd(element, func) {
    let duration = element.style.transitionDuration;

    // No transition defined so trigger callback immediately
    if (duration === '0s' || typeof duration === 'undefined') {
        func.call();

    // Bind a listener once
    } else {
        element.addEventListener('transitionend', once(func));
    }

    return element;
}
