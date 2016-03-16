/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import decorate from './helpers/decorate';
import getValueFunc from './helpers/getValueFunc';

/**
 * Bind the context of a method to the executing objects `this` context.
 * We must override the descriptor as `value()` doesn't use the correct `this` context.
 *
 * @param {Object} target       - The parent class prototype
 * @param {String} name         - Name of the method
 * @param {Object} descriptor   - Descriptor of the method
 * @returns {Object}
 */
function bindMethod(target, name, descriptor) {
    let func = getValueFunc('bind', descriptor);

    return {
        enumerable: false,
        configurable: true,
        get() {
            // This happens if someone accesses the property directly on the prototype
            // Thanks to jayphelps/core-decorators.js for the snippet
            if (this === target) {
                return func;
            }

            // The `this` here is the current class prototype
            // While `target` is the parent class prototype
            let boundFunc = func.bind(this);

            // Define a function on the target so that `get()` is only called once
            // Inherit the original methods descriptor as well
            Object.defineProperty(this, name, {
                ...descriptor,
                enumerable: true,
                value: boundFunc
            });

            return boundFunc;
        },
        set(value) {
            Object.defineProperty(this, name, {
                ...descriptor,
                value
            });
        }
    };
}

/**
 * Bind the context to all methods of the class that start with "on" or "handle".
 *
 * @param {Object} target   - The constructor function
 * @returns {Object}
 */
function bindClass(target) {
    let proto = target.prototype;

    Object.getOwnPropertyNames(proto).forEach(name => {
        if (name.match(/^(on|handle)[A-Z]/)) {
            Object.defineProperty(
              proto,
              name,
              bindMethod(proto, name, Object.getOwnPropertyDescriptor(proto, name))
            );
        }
    });

    return target;
}

/**
 * Automatically bind the context of a single method, or a set of methods on a class.
 *
 * @returns {Object}
 */
export default function bind() {
    return decorate(bindClass, bindMethod, arguments);
}
