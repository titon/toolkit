/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import forOwn from 'libs/object/forOwn';
import isObject from 'libs/object/isObject';

/**
 * Overload a setter method with key value arguments to accept an object of key values.
 *
 * @param {function} func
 * @returns {function}
 */
export default function setter(func) {
    return function(key, value) {
        let self = this;

        if (isObject(key)) {
            forOwn(key, (k, v) => func.call(self, k, v));

        } else if (key) {
            func.call(self, key, value);
        }

        return this;
    };
}

Toolkit.setter = setter;
