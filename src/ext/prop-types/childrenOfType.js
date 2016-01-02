/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { Children } from 'react';

/**
 * A function that will validate that all children of a component are of a specific type.
 *
 * @returns {Function}
 */
export default function childrenOfType(...types) {
    let instances = new WeakSet(types);

    return function(props, propName, componentName) {
        try {
            Children.forEach(props[propName], function(child) {
                if (!instances.has(child.type)) {
                    throw new Error(`\`${componentName}\` does not allow children of type \`${(typeof child.type === 'function') ? child.type.name : child.type}\`.`);
                }
            });
        } catch (e) {
            return e;
        }
    };
}
