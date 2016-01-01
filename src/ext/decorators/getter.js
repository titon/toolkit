/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * The `getter` decorator will overload a getter method to accept an array of keys
 * that returns an object of key value pairs.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function getter(target, name, descriptor) {
    let func = descriptor.value;

    if (typeof func !== 'function') {
        throw new SyntaxError('Only functions can be used as getters.');
    }

    descriptor.value = function(key) {
        let value = {};

        if (Array.isArray(key)) {
            key.forEach(k => value[k] = func.call(this, k));

        } else {
            value = func.call(this, key);
        }

        return value;
    };

    return descriptor;
}
