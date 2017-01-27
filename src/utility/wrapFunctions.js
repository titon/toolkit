/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import invariant from './invariant';

type ArityFunction = (...args: *[]) => void;

/**
 * Wrap a set of functions with a closure allowing them to be executed consecutively.
 */
export default function wrapFunctions(...funcs: ArityFunction[]): ArityFunction {
  return function wrapFunctionsHandler(...args: *[]) {
    funcs.forEach((func) => {
      invariant((typeof func === 'function'),
        'Value passed to `wrapFunctions()` was not a function.');

      func(...args);
    });
  };
}
