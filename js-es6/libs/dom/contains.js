/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

/**
 * Check to see if an element is within the current DOM.
 *
 * @param {Node} element
 * @returns {boolean}
 */
export default function contains(element) {
    let body = document.body;

    if (element instanceof Container) {
        element = element.element;
    }

    return (element === body) ? false : body.contains(element);
}
