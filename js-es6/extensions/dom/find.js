/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import ElementCollection from 'ElementCollection';

const slice = Array.prototype.slice;

/**
 * Find an element or a collection of elements using a CSS selector.
 * This method will return an array of elements.
 *
 * @param {string} query
 * @param {Node} [context]
 * @returns {ElementCollection}
 */
export default function find(query, context = document) {
    return new ElementCollection(slice.call(context.querySelectorAll(query)));
}
