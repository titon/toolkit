/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

import type { DecoratorTarget, Descriptor } from '../types';

/**
 * The `suppressErrors` decorator will catch all thrown errors and
 * return the `Error` object if thrown.
 */
export default function suppressErrors(
  target: DecoratorTarget,
  name: string,
  descriptor: Descriptor,
): Descriptor {
  if (process.env.NODE_ENV !== 'production') {
    checkIsMethod('suppressErrors', arguments);
  }

  const func = getValueFunc('suppressErrors', descriptor);

  descriptor.value = function suppressErrorsValue() {
    try {
      return func.call(this, arguments);
    } catch (e) {
      return e;
    }
  };

  return descriptor;
}
