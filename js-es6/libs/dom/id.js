/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Container from './Container';

/**
 * Return an element by ID. This method will return a single element.
 *
 * @param {string} query
 * @returns {Container}
 */
export default function id(query) {
    return new Container(document.getElementById(query));
}
