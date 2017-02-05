/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import debouncer from 'lodash.debounce';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

import type { DecoratorTarget, Descriptor } from '../types';

/**
 * The `debounce` decorator will wrap a function with Lo-dash's `debounce` function,
 * which delays the execution until a specific wait period is met.
 */
export default function debounce(wait: number = 150) {
  return function debounceDecorator(
    target: DecoratorTarget,
    name: string,
    descriptor: Descriptor,
  ): Descriptor {
    checkIsMethod('debounce', arguments);

    descriptor.value = debouncer(getValueFunc('debounce', descriptor), wait);

    return descriptor;
  };
}
