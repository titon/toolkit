/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';

/**
 * Check to see if a value is an element, usually one that extends `HTMLElement`.
 *
 * @param {*} element
 * @returns {boolean}
 */
export default function isElement(element) {
    return ('HTMLElement' in window)
        ? (element instanceof HTMLElement)
        : (element.nodeName && element.nodeType && element.nodeType === 1);
}

Toolkit.isElement = isElement;
