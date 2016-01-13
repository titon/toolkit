/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';
import throttler from '../../node_modules/lodash/function/throttle';

/**
 * The `throttle` decorator will wrap a function with Lo-dash's `throttle` function,
 * which delays the execution to specific intervals.
 *
 * @param {Number} wait
 * @returns {Function}
 */
export default function throttle(wait = 150) {
    return function(target, name, descriptor) {
        checkIsMethod('throttle', arguments);

        descriptor.value = throttler(getValueFunc('throttle', descriptor), wait);

        return descriptor;
    };
}
