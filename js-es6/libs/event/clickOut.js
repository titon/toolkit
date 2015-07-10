/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import clickOutInstance from 'events/instances/clickOut';

/**
 * Add the element to the list of elements to be monitored for click outs.
 * Return the original handler so that it may be called later on.
 *
 * @param {HTMLElement|HTMLElement[]} element
 * @param {function} func
 * @returns {function}
 */
export default function clickOut(element, func) {
    clickOutInstance.monitor(element);

    return func;
}


Toolkit.clickOut = clickOut;
