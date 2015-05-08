/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';

/**
 * Bound a number between a min and max range.
 * If the number is greater than or equal to the max, reset to min (or 0).
 * If the number is less than the min, reset to the max - 1.
 *
 * @param {number} value
 * @param {number} max
 * @param {number} [min]
 * @returns {number}
 */
export default function bound(value, max, min) {
    min = min || 0;

    if (value >= max) {
        value = min;
    } else if (value < min) {
        value = max - 1;
    }

    return value;
}

Toolkit.bound = bound;
