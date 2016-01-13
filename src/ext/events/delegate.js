/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint callback-return: 0 */

import '../../polyfills/Element.matches.js';

/**
 * Wrap a function that delegates the execution until the target element matches a selector.
 *
 * @param {String} selector
 * @param {Function} func
 * @returns {Function}
 */
export default function delegate(selector, func) {
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
