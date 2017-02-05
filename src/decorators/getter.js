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
 * The `getter` decorator will overload a getter method to accept an array of keys
 * that returns an object of key value pairs.
 */
export default function getter(
  target: DecoratorTarget,
  name: string,
  descriptor: Descriptor,
): Descriptor {
  checkIsMethod('getter', arguments);

  const func = getValueFunc('getter', descriptor);

  descriptor.value = function getterValue(key: string | string[]): mixed {
    let value = {};

    if (Array.isArray(key)) {
      key.forEach((k) => { value[k] = func.call(this, k); });
    } else {
      value = func.call(this, key);
    }

    return value;
  };

  return descriptor;
}
