/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Toolkit from 'Toolkit';

/**
 * Delays the execution of a function till the duration has completed.
 *
 * @param {function} func
 * @param {number} [threshold]
 * @returns {function}
 */
export default function debounce(func, threshold = 150) {
    let timeout;

    if (!threshold) {
        return func;
    }

    return function() {
        let self = this,
            args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
            func.apply(self, args);
        }, threshold);
    };
}

Toolkit.debounce = debounce;
