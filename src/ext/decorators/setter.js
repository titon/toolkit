/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import forOwn from 'lodash/object/forOwn';
import isPlainObject from 'lodash/lang/isPlainObject';

/**
 * The `setter` decorator will overload a setter method with key and value argument to
 * accept an object of key value pairs.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function setter(target, name, descriptor) {
    let func = descriptor.value;

    if (typeof func !== 'function') {
        throw new SyntaxError('Only functions can be used as setters.');
    }

    descriptor.value = function(key, value) {
        if (isPlainObject(key)) {
            forOwn(key, (v, k) => func.call(this, k, v));

        } else if (key) {
            func.call(this, key, value);
        }

        return this;
    };

    return descriptor;
}
