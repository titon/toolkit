/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

/**
 * The `suppressErrors` decorator will catch all thrown errors and
 * return the `Error` object if thrown.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function suppressErrors(target, name, descriptor) {
  checkIsMethod('suppressErrors', arguments);

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
