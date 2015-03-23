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
 * Overload a method and make it chainable if it is not already.
 *
 * @param {function} func
 * @returns {function}
 */
export function chain(func) {
    return () => {
        let response = func.apply(this, arguments);

        return response === undefined ? this : response;
    }
}

/**
 * Overload a getter method to accept an array that returns a set of data.
 *
 * @param {function} func
 * @returns {function}
 */
export function getter(func) {
    return (key) => {
        let value = {},
            self = this;

        if (Array.isArray(key)) {
            key.forEach(k => {
                value[k] = func.call(self, k);
            });
        } else {
            value = func.call(self, key);
        }

        return value;
    };
}

/**
 * Overload a setter method with key value arguments to accept an object of key values.
 *
 * @param {function} func
 * @returns {function}
 */
export function setter(func) {
    return (key, value) => {
        let self = this;

        if (obj.is(key)) {
            obj.forEach(key, (k) => func.call(self, k, key[k]));

        } else if (key) {
            func.call(self, key, value);
        }

        return this;
    };
}
