/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

/**
 * Delays the execution of a function till the duration has completed.
 *
 * @param {function} func
 * @param {number} [threshold]
 * @returns {function}
 */
export function debounce(func, threshold = 150) {
    let timeout;

    return () => {
        let self = this,
            args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
            func.apply(self, args);
        }, threshold);
    };
}

/**
 * Throttle the execution of a function so it triggers at every delay interval.
 *
 * @param {function} func
 * @param {number} [delay]
 * @returns {function}
 */
export function throttle(func, delay = 150) {
    let throttled = false;

    return () => {
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
