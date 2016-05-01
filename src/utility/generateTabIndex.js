/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import 'core-js/modules/es6.weak-map';

// Start at a higher number to leave room for manual app-level indices
let index = 10,
    cache = new WeakMap();

/**
 * A function that generates a tab index in sequential order by keeping a map of
 * every object to its index.
 *
 * @param {Object} obj
 * @returns {Number}
 */
export default function generateTabIndex(obj) {
    if (!cache.has(obj)) {
        cache.set(obj, index++);
    }

    return cache.get(obj);
}
