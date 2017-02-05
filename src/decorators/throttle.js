/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import throttler from 'lodash.throttle';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

import type { DecoratorTarget, Descriptor } from '../types';

/**
 * The `throttle` decorator will wrap a function with Lo-dash's `throttle` function,
 * which delays the execution to specific intervals.
 */
export default function throttle(wait: number = 150) {
  return function throttleDecorator(
    target: DecoratorTarget,
    name: string,
    descriptor: Descriptor,
  ): Descriptor {
    checkIsMethod('throttle', arguments);

    descriptor.value = throttler(getValueFunc('throttle', descriptor), wait);

    return descriptor;
  };
}
