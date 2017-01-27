/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/**
 * Returns true if an element exists outside another element.
 */
export default function isOutsideElement(element: HTMLElement, target: HTMLElement): boolean {
  return (element !== target && !element.contains(target));
}
