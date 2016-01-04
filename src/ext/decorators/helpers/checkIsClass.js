/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Verifies that a decorator is only applied to a class.
 *
 * @param {String} name
 * @param {Arguments} args
 */
export default function checkIsClass(name, args) {
    if (args.length !== 1 || typeof args[0] !== 'function') {
        throw new SyntaxError(`Only classes are supported by @${name}.`);
    }
}
