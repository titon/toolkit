/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint react/prop-types: 0 */

import React, { Children } from 'react';
import formatClass from './utility/formatClass';
import formatID from './utility/formatID';
import invariant from './utility/invariant';
import wrapFunctions from './utility/wrapFunctions';

export default class Component extends React.Component {
  static module = {
    classNames: {},
    name: 'Component',
    version: '3.0.0',
  };

  static contextTypes = {};

  /**
   * Format an element level class name based on the defined argument.
   *
   * @param {String} elementName
   * @param {...String|Array|Object} params
   * @returns {String}
   */
  formatChildClass(elementName, ...params) {
    return formatClass(this.getModuleClass(elementName), ...params);
  }

  /**
   * Format a block level class name.
   *
   * @param {...String|Array|Object} params
   * @returns {String}
   */
  formatClass(...params) {
    return formatClass(this.getModuleClass(), ...params);
  }

  /**
   * Format a unique HTML ID based on the passed parameters.
   *
   * @param {...String} params
   * @returns {String}
   */
  formatID(...params) {
    return formatID('titon', this.uid, ...params);
  }

  /**
   * Generate a new set of properties based on a specific property from the initial property set.
   * If the value is this property is an object, merge it in, else assume it's a boolean.
   *
   * @param {Object} props
   * @param {String} propName
   * @param {String[]} [listeners]
   * @returns {Object}
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
   * Attempt to find the module specific context by key within the context layer.
   *
   * @param {Object} [rawContext]
   * @param {String} [forceKey]
   * @returns {Object}
   */
  getContext(rawContext, forceKey) {
    const { name, module } = this.constructor;
    const { name: moduleName, contextKey } = module;
    const context = rawContext || this.context;
    const key = forceKey || contextKey;

    invariant(!this.getChildContext, 'Parent component must not attempt to access context.');

    invariant(key && context[key],
      'Context "%s" not found for `%s.%s`.',
      key, moduleName, name);

    return context[key];
  }

  /**
   * Attempt to find the block or element class name within the modules classnames mapping.
   *
   * @param {String} element
   * @returns {String}
   */
  getModuleClass(element = 'default') {
    const { name, module } = this.constructor;
    const { name: moduleName, classNames } = module;

    invariant(classNames[element],
      'Module class name "%s" not found for `%s.%s`.',
      element, moduleName, name);

    return classNames[element];
  }

  /**
   * Return the `ReactElement` associated with the component.
   *
   * @returns {ReactElement}
   */
  getInternalElement() {
    return this._reactInternalInstance._currentElement;
  }

  /**
   * Handle a native / synthetic DOM event and notify all listeners
   * defined on the property of the same name.
   *
   * @param {String} type
   * @param {SyntheticEvent} event
   */
  handleEvent(type, event) {
    this.notifyEventListeners(type, [event]);
  }

  /**
   * Execute a function, or an array of functions, with the defined arguments,
   * for the specified property.
   *
   * @param {String} propName
   * @param {*[]} args
   */
  notifyEventListeners(propName, args = []) {
    if (propName.substr(0, 2) !== 'on') {
      propName = `on${propName.charAt(0).toUpperCase()}${propName.substr(1)}`;
    }

    let listeners = this.props[propName];

    if (!listeners) {
      return;
    } else if (!Array.isArray(listeners)) {
      listeners = [listeners];
    }

    listeners.forEach(func => func(...args));
  }

  /**
   * Transfer all custom props to the first and only child of the current component.
   * This functionality allows for easy composition and wrapping of components.
   *
   * @param {ReactElement|ReactElement[]} children
   * @param {Object} [props]
   * @returns {ReactElement}
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
