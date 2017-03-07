/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

export default function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
