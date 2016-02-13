/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Wrap a set of functions with a closure allowing them to be executed consecutively.
 *
 * @param {...Function} funcs
 * @returns {Function}
 */
export default function wrapFunctions(...funcs) {
    return function(...args) {
        funcs.forEach(func => {
            if (typeof func === 'function') {
                func(...args);
            } else {
                throw new Error('Value passed to `wrapFunctions()` was not a function.');
            }
        });
    };
}
