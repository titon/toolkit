/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Toolkit from 'Toolkit';

/**
 * Wrap a function that will only be triggered once when set as an event listener.
 *
 * @param {function} func
 * @returns {function}
 */
export default function once(func) {
    var listener = function(event) {
        event.target.removeEventListener(event.type, listener);

        func(event);
    };

    return listener;
}

Toolkit.once = once;
