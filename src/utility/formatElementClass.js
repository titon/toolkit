/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import formatClass from './formatClass';

/**
 * Format a unique HTML/CSS class name that will be used as the "element" class
 * in the BEM naming pattern. An array of additional classes and modifiers
 * can be passed as parameters.
 *
 * @param {String} blockClass
 * @param {String} elementClass
 * @param {...String|Array|Object} params
 * @returns {String}
 */
export default function formatElementClass(blockClass, elementClass, ...params) {
    return formatClass([blockClass, elementClass], ...params);
}
