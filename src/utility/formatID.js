/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Format a unique HTML ID based on the passed parameters.
 *
 * @param {...String} params
 * @returns {String}
 */
export default function formatID(...params) {
    return params.join('-').trim().replace(/[^a-zA-Z0-9\-_:\.]/, '-');
}
