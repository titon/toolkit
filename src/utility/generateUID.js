/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Generate a random unique identifier.
 *
 * @returns {String}
 */
export default function generateUID() {
  return Math.random().toString(32).substr(2);
}
