/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Titon from '../Titon';

/**
 * Generate a BEM (block-element-modifier) valid CSS class name.
 * Supports the following three formats:
 *
 * With strings:
 *
 *      formatBEM('block', 'element', 'modifier');
 *
 * With arrays:
 *
 *      formatBEM(['block', 'element', 'modifier']);
 *
 * With objects:
 *
 *      formatBEM({ block: 'block', element: 'element', modifier: 'modifier' });
 *
 * @param {String|Array|Object} block
 * @param {String} [element]
 * @param {String} [modifier]
 * @returns {String}
 */
export default function formatBEM(block, element = '', modifier = '') {
    if (Array.isArray(block)) {
        return formatBEM(...block);

    } else if (typeof block === 'object') {
        return formatBEM(block.block, block.element, block.modifier);
    }

    let className = block || '';

    if (element) {
        if (className) {
            className += Titon.options.elementSeparator;
        }

        className += element;
    }

    if (modifier && className) {
        className += Titon.options.modifierSeparator + modifier;
    }

    return className;
}
