/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * The `remover` decorator will overload a remover method to accept an array of keys
 * that removes multiple keys from an object / collection.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function remover(target, name, descriptor) {
    let func = descriptor.value;

    if (typeof func !== 'function') {
        throw new SyntaxError('Only functions can be used as removers.');
    }

    descriptor.value = function(key) {
        if (Array.isArray(key)) {
            key.forEach(k => func.call(this, k));

        } else {
            func.call(this, key);
        }

        return this;
    };

    return descriptor;
}
