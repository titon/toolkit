/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Titon from 'Titon';

/**
 * Generate a BEM (block-element-modifier) valid CSS class name.
 *
 * @param {String} block
 * @param {String} [element]
 * @param {String} [modifier]
 * @returns {String}
 */
export default function bem(block, element, modifier) {
    let seps = bem.separators;

    if (element) {
        block += seps[0] + element;
    }

    if (modifier) {
        block += seps[1] + modifier;
    }

    return Titon.namespace + block;
}

/**
 * BEM class name separators.
 */
bem.separators = ['-', '--'];
