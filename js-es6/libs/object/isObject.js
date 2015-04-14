/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

/**
 * Verify that a value is an actual object, and is not an instance of the object types,
 * like Array, Date, etc.
 *
 * @param {*} object
 * @returns {boolean}
 */
export default function isObject(object) {
    return (Object.prototype.toString.call(object) === '[object Object]');
}
