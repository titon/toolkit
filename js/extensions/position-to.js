/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery'
], function($) {

/**
 * Position the element relative to another element in the document, or to the mouse cursor.
 * Determine the offsets through the `relativeTo` argument, which can be an event, or a jQuery element.
 * Re-position the element if its target coordinates fall outside of the viewport.
 * Optionally account for mouse location and base offset coordinates.
 *
 * @param {String} position
 * @param {Event|jQuery} relativeTo
 * @param {Object} [baseOffset]
 * @param {bool} [isMouse]
 * @returns {jQuery}
 */
$.fn.positionTo = function(position, relativeTo, baseOffset, isMouse) {
    if (!position) {
        return this;
    }

    var offset = baseOffset || { left: 0, top: 0 },
        relOffset,
        relHeight = 0,
        relWidth = 0,
        eHeight = this.outerHeight(true),
        eWidth = this.outerWidth(true),
        win = $(window),
        wWidth = win.width(),
        wHeight = win.height(),
        wsTop = win.scrollTop();

    // If an event is used, position it near the mouse
    if (relativeTo.preventDefault) {
        relOffset = { left: relativeTo.pageX, top: relativeTo.pageY };

    // Else position it near the element
    } else {
        relOffset = relativeTo.offset();
        relHeight = relativeTo.outerHeight();
        relWidth = relativeTo.outerWidth();
    }

    offset.left += relOffset.left;
    offset.top += relOffset.top;

    var top = offset.top,
        left = offset.left;

    // Shift around based on edge positioning
    var parts = position.split('-'),
        edge = { y: parts[0], x: parts[1] };

    if (edge.y === 'top') {
        top -= eHeight;

    } else if (edge.y === 'bottom') {
        top += relHeight;

    } else if (edge.y === 'center') {
        top -= Math.round((eHeight / 2) - (relHeight / 2));
    }

    if (edge.x === 'left') {
        left -= eWidth;

    } else if (edge.x === 'right') {
        left += relWidth;

    } else if (edge.x === 'center') {
        left -= Math.round((eWidth / 2) - (relWidth / 2));
    }

    // Shift again to keep it within the viewport
    if (left < 0) {
        left = 0;

    } else if ((left + eWidth) > wWidth) {
        left = wWidth - eWidth;
    }

    if (top < 0) {
        top = 0;

    } else if ((top + eHeight) > (wHeight + wsTop)) {
        top = relOffset.top - eHeight;
    }

    // Increase the offset in case we are following the mouse cursor
    // We need to leave some padding for the literal cursor to not cause a flicker
    if (isMouse) {
        if (edge.y === 'center') {
            if (edge.x === 'left') {
                left -= 15;
            } else if (edge.x === 'right') {
                left += 15;
            }
        }

        if (edge.x === 'center') {
            if (edge.y === 'top') {
                top -= 10;
            } else if (edge.y === 'bottom') {
                top += 10;
            }
        }
    }

    return this.css({
        left: left,
        top: top
    });
};

});