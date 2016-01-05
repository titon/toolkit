/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Titon from '../../Titon';

/**
 * Generate a BEM (block-element-modifier) valid CSS class name.
 *
 * @param {String|Array} block
 * @param {String} [element]
 * @param {String} [modifier]
 * @returns {String}
 */
export default function bem(block, element = '', modifier = '') {
    if (Array.isArray(block)) {
        return bem(...block);
    }

    if (element) {
        block += Titon.options.elementSeparator + element;
    }

    if (modifier) {
        block += Titon.options.modifierSeparator + modifier;
    }

    return block;
}
