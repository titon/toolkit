/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { Children } from 'react';
import invariant from '../utility/invariant';

/**
 * A function that will validate that all children of a component are of a specific type.
 *
 * @param {...*} types
 * @returns {Function}
 */
export default function children(...types) {
    let instances = new WeakSet(types);

    return function(props, propName, componentName) {
        try {
            Children.forEach(props[propName], function(child) {
                invariant(instances.has(child.type),
                    '`%s` does not allow children of type `%s`.', componentName,
                    (typeof child.type === 'function') ? child.type.name : child.type);
            });
        } catch (e) {
            return e;
        }

        return true;
    };
}
