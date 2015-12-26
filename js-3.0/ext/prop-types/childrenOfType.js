/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { Children } from 'react';

/**
 * A function that will validate that all children of a component are of a specific type.
 *
 * @param {Class} instance
 * @returns {Function}
 */
export default function childrenOfType(instance) {
    return function(props, propName, componentName) {
        try {
            Children.forEach(props[propName], function (child) {
                if (child.type !== instance) {
                    throw new Error('`' + componentName + '` only accepts children of type `' + instance.name + '`.');
                }
            });
        } catch (e) {
            return e;
        }
    };
}
