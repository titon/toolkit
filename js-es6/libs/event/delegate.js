/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Toolkit from 'Toolkit';
import 'polyfills/element/matches';

/**
 * Wrap a function that delegates the execution until the target element matches a selector.
 *
 * @param {string} selector
 * @param {function} func
 * @returns {function}
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

Toolkit.delegate = delegate;
