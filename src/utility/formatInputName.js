/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Format a form field input name by removing invalid characters.
 *
 * @param {String} name
 * @returns {String}
 */
export default function formatInputName(name) {
    return (name || '')
        .replace('[]', '')
        .replace('[', '-')
        .replace('][', '-')
        .replace(/[^a-z0-9_\-]+/i, '');
}
