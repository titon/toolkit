/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Titon from '../Titon';
import formatBEM from './formatBEM';

/**
 * Generate a mapping of CSS class names for the block level class,
 * and all the element classes.
 *
 * @param {String} blockClass
 * @param {String[]} elementClasses
 * @returns {Object}
 */
export default function generateClassNames(blockClass, elementClasses = []) {
  let namespace = Titon.options.namespace,
    classNames = { default: namespace + formatBEM(blockClass) };

  elementClasses.forEach((elementClass) => {
    classNames[elementClass] = namespace + formatBEM(blockClass, elementClass);
  });

  return classNames;
}
