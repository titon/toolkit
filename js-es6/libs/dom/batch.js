/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';

/**
 * Batch multiple mutations of an element to limit the reflow and repaint.
 *
 * @param {HTMLElement} element
 * @param {function} func
 * @param {*} context
 * @returns {HTMLElement}
 */
export default function batch(element, func, context) {
    let parent = element.parentNode,
        next = element.nextSibling;

    // Exit if no parent
    if (!parent) {
        return element;
    }

    // Detach from the DOM
    parent.removeChild(element);

    // Execute callback
    func.call(context || element, element);

    // Re-attach in the DOM
    if (next) {
        parent.insertBefore(element, next);
    } else {
        parent.appendChild(element);
    }

    return element;
}

Toolkit.batch = batch;
