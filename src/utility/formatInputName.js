/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/**
 * Format a form field input name by removing invalid characters.
 */
export default function formatInputName(name: string): string {
  return (name || '').trim()
    .replace('[]', '')
    .replace('[', '-')
    .replace('][', '-')
    .replace(/[^a-z0-9_-]+/i, '');
}
