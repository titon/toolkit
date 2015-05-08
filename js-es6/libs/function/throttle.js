/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Toolkit from 'Toolkit';

/**
 * Throttle the execution of a function so it triggers at every delay interval.
 *
 * @param {function} func
 * @param {number} [delay]
 * @returns {function}
 */
export default function throttle(func, delay = 150) {
    let throttled = false;

    if (!delay) {
        return func;
    }

    return function() {
        let self = this,
            args = arguments;

        if (!throttled) {
            throttled = true;

            setTimeout(() => {
                func.apply(self, args);
                throttled = false;
            }, delay);
        }
    };
}

Toolkit.throttle = throttle;
