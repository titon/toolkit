/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import throttler from 'lodash.throttle';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

/**
 * The `throttle` decorator will wrap a function with Lo-dash's `throttle` function,
 * which delays the execution to specific intervals.
 *
 * @param {Number} wait
 * @returns {Function}
 */
export default function throttle(wait = 150) {
  return function throttleDecorator(target, name, descriptor) {
    checkIsMethod('throttle', arguments);

    descriptor.value = throttler(getValueFunc('throttle', descriptor), wait);

    return descriptor;
  };
}
