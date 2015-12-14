import React from 'react';

/**
 * A function that will validate all children of a component are of a specific type.
 *
 * @param {Class} instance
 * @returns {Function}
 */
export default function validateChildrenPropType(instance) {
    return function(props, propName, componentName) {
        React.Children.forEach(props[propName], function(child) {
            if (child.type !== instance) {
                throw new Error('`' + componentName + '` only accepts children of type `' + instance.name + '`.');
            }
        });
    };
}
