/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Element from 'extensions/dom/Element';

/**
 * Return an element by ID. This method will return a single element.
 *
 * @param {string} query
 * @returns {Element}
 */
export default function findID(query) {
    if (query[0] === '#') {
        query = query.substr(1);
    }

    let element = document.getElementById(query);

    return element ? new Element(element) : null;
}
