/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

/**
 * Overload a getter method to accept an array that returns a set of data.
 *
 * @param {function} func
 * @returns {function}
 */
export default function getter(func) {
    return function(key) {
        let value = {},
            self = this;

        if (Array.isArray(key)) {
            key.forEach(k => value[k] = func.call(self, k));

        } else {
            value = func.call(self, key);
        }

        return value;
    };
}
