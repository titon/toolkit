/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Collection from 'extensions/dom/Collection';

const slice = Array.prototype.slice;

/**
 * Find an element or a collection of elements using a CSS selector.
 * This method will return an array of elements.
 *
 * @param {string} query
 * @param {Node} [context]
 * @returns {Collection}
 */
export default function find(query, context = document) {
    return new Collection(slice.call(context.querySelectorAll(query)));
}
