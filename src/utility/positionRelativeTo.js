/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint max-params: 0, array-bracket-spacing: 0 */

/**
 * Calculate a `top` and `left` value to position an element relative to another element using
 * absolute positioning.
 *
 * @param {String} position
 * @param {Element} sourceElement - The element to position
 * @param {Element|Event} relativeTo - The element or event to calculate relative to
 * @param {Object} baseOffset - Initial top and left values
 * @param {Boolean} isMouse - Whether this should follow the mouse or not
 * @returns {{left: number, top: number}}
 */
export default function positionRelativeTo(
    position,
    sourceElement,
    relativeTo,
    baseOffset = { left: 0, top: 0 },
    isMouse = false
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

    } else if (edgeY === 'center') {
        top -= Math.round((srcHeight / 2) - (relHeight / 2));

    } else if (edgeY === 'bottom') {
        top += relHeight;
    }

    if (edgeX === 'left') {
        left -= srcWidth;

    } else if (edgeX === 'center') {
        left -= Math.round((srcWidth / 2) - (relWidth / 2));

    } else if (edgeX === 'right') {
        left += relWidth;
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

    // Increase the offset in case we are following the mouse cursor
    // We need to leave some padding for the literal cursor to not cause a flicker
    if (isMouse) {
        if (edgeY === 'center') {
            if (edgeX === 'left') {
                left -= 15;
            } else if (edgeX === 'right') {
                left += 15;
            }
        }

        if (edgeX === 'center') {
            if (edgeY === 'top') {
                top -= 10;
            } else if (edgeY === 'bottom') {
                top += 10;
            }
        }
    }

    return {
        left,
        top
    };
}
