/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Element from 'Element';

/**
 * Check to see if an element is within the current DOM.
 *
 * @param {Node} element
 * @returns {boolean}
 */
export default function inDOM(element) {
    let body = document.body;

    if (element instanceof Element) {
        element = element.element;
    }

    return (element === body) ? false : body.contains(element);
}
