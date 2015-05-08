/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import Element from './Element';

/**
 * Return an element by ID. This method will return a single element.
 *
 * @param {string} query
 * @returns {Element}
 */
export default function id(query) {
    let element = document.getElementById(query);

    return element ? new Element(element) : null;
}

Toolkit.findID = id;
