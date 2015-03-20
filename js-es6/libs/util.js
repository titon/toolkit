/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import * as obj from 'object';

/**
 * Bound a number between a min and max range.
 * If the number is greater than or equal to the max, reset to min (or 0).
 * If the number is less than the min, reset to the max - 1.
 *
 * @param {number} value
 * @param {number} max
 * @param {number} [min]
 * @returns {number}
 */
export function bound(value, max, min) {
    min = min || 0;

    if (value >= max) {
        value = min;
    } else if (value < min) {
        value = max - 1;
    }

    return value;
}

/**
 * Overload a getter method to accept an array that returns a set of data.
 *
 * @param {function} callback
 * @returns {function}
 */
export function getter(callback) {
    return (context, key) => {
        let value = {};

        if (Array.isArray(key)) {
            key.forEach(k => {
                value[k] = callback.call(context, k);
            });
        } else {
            value = callback.call(context, key);
        }

        return value;
    };
}

/**
 * Overload a setter method with key value arguments to accept an object of key values.
 *
 * @param {function} callback
 * @returns {function}
 */
export function setter(callback) {
    return (context, key, value) => {
        if (obj.is(key)) {
            obj.forEach(key, (k) => callback.call(context, k, key[k]));

        } else if (key) {
            callback.call(context, key, value);
        }

        return this;
    };
}
