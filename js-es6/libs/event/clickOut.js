/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import ClickOut from 'events/ClickOut';

/**
 * Wrap a function that monitors click out events by appending the element to be monitored
 * to the global ClickOut handler.
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {function} func
 * @returns {function}
 */
export default function clickOut(element, func) {
    if (Array.isArray(element)) {
        element.forEach(el => {
            ClickOut.elements.add(el);
        });
    } else {
        ClickOut.elements.add(element);
    }

    return func;
}


Toolkit.clickOut = clickOut;
