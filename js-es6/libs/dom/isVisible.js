/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Toolkit from 'Toolkit';

/**
 * Check if the element is visible. Is used for CSS animations and transitions.
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export default function isVisible(element) {
    return (element.style.visibility !== 'hidden');
}

Toolkit.isVisible = isVisible;
