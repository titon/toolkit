/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import ClassBuilder from './ClassBuilder';

/**
 * Format a unique HTML/CSS class name that will be used as the "block" class
 * in the BEM naming pattern. An array of additional classes and modifiers
 * can be passed as parameters.
 *
 * @param {String|Array|Object} className
 * @param {...String|Array|Object} params
 * @returns {String}
 */
export default function formatClass(className, ...params) {
  return new ClassBuilder(className).mapParams(...params).toString();
}
