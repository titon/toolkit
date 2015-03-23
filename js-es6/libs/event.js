/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

/**
 * Wrap a function that delegates the execution until the target element matches a selector.
 *
 * @param {string} selector
 * @param {function} func
 * @returns {function}
 */
export function delegate(selector, func) {
    return e => {
        let target = e.target;

        while (target) {
            if (target.matches(selector)) {
                e.delegatedTarget = target;
                func.apply(this, arguments);
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
    return e => {
        e.target.removeEventListener(e.type, func);

        func.apply(this, arguments);
    };
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

    element.addEventListener('transitionend', once(func));

    // No transition defined so trigger callback immediately
    if (duration === '0s' || typeof duration === 'undefined') {
        element.dispatchEvent(new TransitionEvent('transitionend'));
    }

    return element;
}
