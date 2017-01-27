/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/**
 * Format a unique HTML ID based on the passed parameters.
 */
export default function formatID(...params: string[]): string {
  return ['titon', ...params]
    .map(id => String(id).trim())
    .join('-')
    .replace(/[^a-zA-Z0-9\-_:.]/g, '')
    .trim();
}
