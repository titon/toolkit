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
 * @param {String} blockClass
 * @param {String[]} elementClasses
 * @returns {Object}
 */
export default function defineModule(name, version, blockClass, elementClasses = []) {
    const module = {};

    Object.defineProperty(module, 'name', { value: name });
    Object.defineProperty(module, 'version', { value: version });
    Object.defineProperty(module, 'classNames', {
        value: generateClassNames(blockClass, elementClasses),
        writable: true
    });

    return module;
}
