/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import isPlainObject from 'lodash/isPlainObject';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

import type { DecoratorTarget, Descriptor } from '../types';

/**
 * The `setter` decorator will overload a setter method with key and value argument to
 * accept an object of key value pairs.
 */
export default function setter(
  target: DecoratorTarget,
  name: string,
  descriptor: Descriptor,
): Descriptor {
  checkIsMethod('setter', arguments);

  const func = getValueFunc('setter', descriptor);

  descriptor.value = function setterValue(key: string | Object, value: *): Descriptor {
    if (isPlainObject(key)) {
      // $FlowIgnore Cannot infer typeof from lodash
      Object.keys(key).forEach(k => func.call(this, k, key[k]));
    } else if (key) {
      func.call(this, key, value);
    }

    return this;
  };

  return descriptor;
}
