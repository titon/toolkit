/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import memoizer from 'lodash/memoize';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

import type { DecoratorTarget, Descriptor } from '../types';

/**
 * The `memoize` decorator will cache the result of a function/method and return that same value
 * on each subsequent call. Makes use of Lo-dash's `memoize` function.
 */
export default function memoize(
  target: DecoratorTarget,
  name: string,
  descriptor: Descriptor,
): Descriptor {
  if (process.env.NODE_ENV !== 'production') {
    checkIsMethod('memoize', arguments);
  }

  descriptor.value = memoizer(
    getValueFunc('memoize', descriptor),
    (...args) => JSON.stringify(args),
  );

  return descriptor;
}
