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
 * The `remover` decorator will overload a remover method to accept an array of keys
 * that removes multiple keys from an object / collectionOf.
 */
export default function remover(
  target: DecoratorTarget,
  name: string,
  descriptor: Descriptor,
): Descriptor {
  checkIsMethod('remover', arguments);

  const func = getValueFunc('remover', descriptor);

  descriptor.value = function removerValue(key: string | string []): Descriptor {
    if (Array.isArray(key)) {
      key.forEach(k => func.call(this, k));
    } else {
      func.call(this, key);
    }

    return this;
  };

  return descriptor;
}
