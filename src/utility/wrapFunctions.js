/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import invariant from './invariant';

/**
 * Wrap a set of functions with a closure allowing them to be executed consecutively.
 *
 * @param {...Function} funcs
 * @returns {Function}
 */
export default function wrapFunctions(...funcs) {
    return function wrapFunctionsHandler(...args) {
        funcs.forEach(func => {
            invariant((typeof func === 'function'),
                'Value passed to `wrapFunctions()` was not a function.');

            func(...args);
        });
    };
}
