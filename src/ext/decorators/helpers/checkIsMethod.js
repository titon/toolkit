/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Verifies that a decorator is only applied to a class method or function.
 *
 * @param {String} name
 * @param {Arguments} args
 */
export default function checkIsMethod(name, args) {
    if (args.length !== 3 || typeof args[2] !== 'object') {
        throw new SyntaxError(`Only methods are supported by @${name}.`);
    }
}
