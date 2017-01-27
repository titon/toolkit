/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

// TODO
// Start at a higher number to leave room for manual app-level indices
const cache = new WeakMap();
let index = 10;

/**
 * A function that generates a tab index in sequential order by keeping a map of
 * every object to its index.
 *
 * @param {Object} obj
 * @returns {Number}
 */
export default function generateTabIndex(obj) {
  if (!cache.has(obj)) {
    cache.set(obj, index += 1);
  }

  return cache.get(obj);
}
