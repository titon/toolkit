/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import checkIsMethod from './helpers/checkIsMethod';
import isPlainObject from '../../node_modules/lodash/lang/isPlainObject';
import getValueFunc from './helpers/getValueFunc';

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
    checkIsMethod('setter', arguments);

    let func = getValueFunc('setter', descriptor);

    descriptor.value = function(key, value) {
        if (isPlainObject(key)) {
            Object.keys(key).forEach(k => func.call(this, k, key[k]));

        } else if (key) {
            func.call(this, key, value);
        }

        return this;
    };

    return descriptor;
}
