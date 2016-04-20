/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint max-params: 0, array-bracket-spacing: 0 */

/**
 * Calculate `top` and `left` values to position an element relative to another element using
 * absolute positioning.
 *
 * Supported positions: top, top-left, top-right, left, right, bottom, bottom-left, bottom-right.
 *
 * @param {String} position
 * @param {Element} sourceElement - The element to position
 * @param {Element|Event} relativeTo - The element or event to calculate relative to
 * @param {Object} baseOffset - Initial top and left values
 * @returns {{left: number, top: number}}
 */
export default function positionRelativeTo(
    position,
    sourceElement,
    relativeTo,
    baseOffset = { left: 0, top: 0 }
) {
    let { top, left } = baseOffset,
        [ edgeY, edgeX ] = position.split('-'),
        srcSize = sourceElement.getBoundingClientRect(),
        srcWidth = srcSize.width,
        srcHeight = srcSize.height,
        relSize = {},
        relTop = 0,
        relHeight = 0,
        relWidth = 0;

    // Fix the x axis
    if (edgeY === 'left' || edgeY === 'right') {
        edgeX = edgeY;
        edgeY = null;
    }

    // If an event is used, position it near the mouse
    if (relativeTo.preventDefault) {
        top += relativeTo.pageY;
        left += relativeTo.pageX;

    // Else position it relative to the element
    } else {
        relSize = relativeTo.getBoundingClientRect();
        relHeight = relSize.height;
        relWidth = relSize.width;
        relTop = relSize.top + window.scrollY;

        top += relTop;
        left += relSize.left;
    }

    // Shift around based on edge positioning
    if (edgeY === 'top') {
        top -= srcHeight;

    } else if (edgeY === 'bottom') {
        top += relHeight;

    } else {
        top -= Math.round((srcHeight / 2) - (relHeight / 2));
    }

    if (edgeX === 'left') {
        left -= srcWidth;

    } else if (edgeX === 'right') {
        left += relWidth;

    } else {
        left -= Math.round((srcWidth / 2) - (relWidth / 2));
    }

    // Shift again to keep it within the viewport
    if (left < 0) {
        left = 0;

    } else if ((left + srcWidth) > window.outerWidth) {
        left = window.outerWidth - srcWidth;
    }

    if (top < 0) {
        top = 0;

    } else if ((top + srcHeight) > (window.outerHeight + window.scrollY)) {
        top = relTop - srcHeight;
    }

    return {
        left,
        top
    };
}
