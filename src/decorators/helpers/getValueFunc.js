/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Returns the `value` function from the descriptor, or throws an error otherwise.
 *
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Function}
 */
export default function getValueFunc(name, descriptor) {
    let func = descriptor.value;

    if (typeof func !== 'function') {
        throw new SyntaxError(`Only functions can be used by @${name}.`);
    }

    return func;
}
