/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

/**
 * The `remover` decorator will overload a remover method to accept an array of keys
 * that removes multiple keys from an object / collection.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function remover(target, name, descriptor) {
    checkIsMethod('remover', arguments);

    let func = getValueFunc('remover', descriptor);

    descriptor.value = function removerValue(key) {
        if (Array.isArray(key)) {
            key.forEach(k => func.call(this, k));

        } else {
            func.call(this, key);
        }

        return this;
    };

    return descriptor;
}
