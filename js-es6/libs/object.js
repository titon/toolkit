/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

/**
 * Helper function for looping over an object.
 * Since this is an object, we must loop over the keys to efficiently iterate.
 *
 * @param {object} object
 * @param {function} func
 */
export function forEach(object, func) {
    Object.keys(object).forEach(func);
}

/**
 * Verify that a value is an actual object, and is not an instance of the object types,
 * like Array, Date, etc.
 *
 * @param {*} object
 * @returns {boolean}
 */
export function is(object) {
    return (Object.prototype.toString.call(object) === '[object Object]');
}

/**
 * Merge multiple objects into a base object. If 2 values collide and they are both objects,
 * attempt to recursively merge the object, else overwrite the base value.
 *
 * @param {object} base
 * @param {object} objects
 * @returns {object}
 */
export function merge(base, ...objects) {
    objects.forEach(object => {
        forEach(object, key => {
            var baseValue = base[key],
                newValue = object[key];

            // Merge if both values are objects
            if (is(baseValue) && is(newValue)) {
                base[key] = merge({}, baseValue, newValue);

            // Overwrite from newer
            } else {
                base[key] = newValue;
            }
        });
    });

    return base;
}
