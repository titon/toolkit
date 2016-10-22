/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import memoizer from 'lodash.memoize';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

/**
 * The `memoize` decorator will cache the result of a function/method and return that same value
 * on each subsequent call. Makes use of Lo-dash's `memoize` function.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function memoize(target, name, descriptor) {
  checkIsMethod('memoize', arguments);

  descriptor.value = memoizer(
    getValueFunc('memoize', descriptor),
    (...args) => JSON.stringify(args)
  );

  return descriptor;
}
