/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';

/**
 * Helper function for looping over an object.
 * Since this is an object, we must loop over the keys to efficiently iterate.
 *
 * @param {object} object
 * @param {function} func
 */
export default function forOwn(object, func) {
    Object.keys(object).forEach(func);
}

Toolkit.forOwn = forOwn;
