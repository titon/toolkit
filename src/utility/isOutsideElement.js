/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Returns true if an element exists outside another element.
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} target
 * @returns {Boolean}
 */
export default function isOutsideElement(element, target) {
  return (element !== target && !element.contains(target));
}
