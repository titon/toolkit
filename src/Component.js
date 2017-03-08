/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint react/prop-types: 0 */

import React, { Children } from 'react';
import wrapFunctions from './utility/wrapFunctions';

export default class Component extends React.Component {
  /**
   * Generate a new set of properties based on a specific property from the initial property set.
   * If the value is this property is an object, merge it in, else assume it's a boolean.
   */
  generateNestedProps(props, propName, listeners = []) {
    let obj = {};

    // Merge nested object
    if (typeof props[propName] === 'object') {
      obj = {
        ...props[propName],
        enabled: true,
      };
    } else {
      obj.enabled = Boolean(props[propName]);
    }

    if (!obj.enabled) {
      return obj;
    }

    // Inherit event listeners
    listeners.forEach((key) => {
      if (!obj[key]) {
        obj[key] = [];
      }

      if (Array.isArray(props[key])) {
        obj[key] = obj[key].concat(props[key]);
      } else if (props[key]) {
        obj[key].push(props[key]);
      }
    });

    return obj;
  }

  /**
   * Transfer all custom props to the first and only child of the current component.
   * This functionality allows for easy composition and wrapping of components.
   */
  transferToChild(children, props = {}) {
    const child = Children.only(children);
    const mergedProps = {};

    Object.keys(props).forEach((key) => {
      const newValue = props[key];
      const newType = typeof newValue;
      const oldValue = child.props[key];
      const oldType = typeof oldValue;
      let mergedValue = null;

      // If a value exists on both ends, handle accordingly
      // We need to do `typeof` checks so that we don't type juggle incorrectly
      if (oldType !== 'undefined' && newType !== 'undefined') {
        // Event handlers should be wrapped
        if (key.match(/^on[A-Z]/)) {
          mergedValue = wrapFunctions(newValue, oldValue);

        // Append the new class name
        } else if (key === 'className' || key.match(/^[a-zA-Z]ClassName$/)) {
          mergedValue = `${oldValue} ${newValue}`;
        }
      } else if (oldType === 'undefined' && newType !== 'undefined') {
        mergedValue = newValue;
      }

      if (mergedValue !== null) {
        mergedProps[key] = mergedValue;
      }
    });

    return React.cloneElement(child, mergedProps);
  }
}
