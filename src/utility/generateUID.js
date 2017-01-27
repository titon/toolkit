/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/**
 * Generate a random unique identifier.
 */
export default function generateUID(): string {
  return Math.random().toString(32).substr(2);
}
