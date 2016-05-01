/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import generateClassNames from './generateClassNames';

/**
 * Create a module metadata object by defining read-only name and version properties.
 * Furthermore, generate a mapping of customizable CSS class names.
 *
 * @param {String} name
 * @param {String} version
 * @param {Object} options
 * @returns {Object}
 */
export default function defineModule(name, version, options = {}) {
    const module = {};

    Object.defineProperty(module, 'name', { value: name });
    Object.defineProperty(module, 'version', { value: version });

    // The name of the key in the context
    if (options.contextKey) {
        Object.defineProperty(module, 'contextKey', { value: options.contextKey });
    }

    // Generate BEM styled class names
    if (options.blockClass || options.elementClasses) {
        Object.defineProperty(module, 'classNames', {
            value: generateClassNames(options.blockClass || '', options.elementClasses || []),
            writable: true
        });
    }

    return module;
}
