/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import forOwn from 'libs/object/forOwn';
import isObject from 'libs/object/isObject';

/**
 * Merge multiple objects into a base object. If 2 values collide and they are both objects,
 * attempt to recursively merge the object, else overwrite the base value.
 *
 * @param {object} base
 * @param {object} objects
 * @returns {object}
 */
export default function merge(base, ...objects) {
    objects.forEach(object => {
        forOwn(object, (key, newValue) => {
            var baseValue = base[key];

            // Merge if both values are objects
            if (isObject(baseValue) && isObject(newValue)) {
                base[key] = merge({}, baseValue, newValue);

            // Overwrite from newer
            } else {
                base[key] = newValue;
            }
        });
    });

    return base;
}

Toolkit.merge = merge;
