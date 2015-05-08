/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Toolkit from 'Toolkit';

/**
 * Overload a method and make it chainable if it is not already.
 *
 * @param {function} func
 * @returns {function}
 */
export default function chain(func) {
    return function() {
        let response = func.apply(this, arguments);

        return (typeof response === 'undefined') ? this : response;
    };
}

Toolkit.chain = chain;
