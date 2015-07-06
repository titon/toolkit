/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import forOwn from 'lodash/object/forOwn';
import isPlainObject from 'lodash/lang/isPlainObject';

/**
 * Overload a setter method with key value arguments to accept an object of key values.
 *
 * @param {function} func
 * @returns {function}
 */
export default function setter(func) {
    return function(key, value) {
        let self = this;

        if (isPlainObject(key)) {
            forOwn(key, (v, k) => func.call(self, k, v));

        } else if (key) {
            func.call(self, key, value);
        }

        return this;
    };
}

Toolkit.setter = setter;
