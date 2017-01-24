/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

/**
 * The `getter` decorator will overload a getter method to accept an array of keys
 * that returns an object of key value pairs.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function getter(target, name, descriptor) {
  checkIsMethod('getter', arguments);

  const func = getValueFunc('getter', descriptor);

  descriptor.value = function getterValue(key) {
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
