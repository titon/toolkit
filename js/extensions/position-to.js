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

    var newPosition = position,
        offset = baseOffset || { left: 0, top: 0 },
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

    // Re-position element if outside the viewport
    offset.left += relOffset.left;
    offset.top += relOffset.top;

    if ((relOffset.top - eHeight - wsTop) < 0) {
        newPosition = newPosition.replace('top', 'bottom');

    } else if ((relOffset.top + relHeight + eHeight) > wHeight) {
        newPosition = newPosition.replace('bottom', 'top');
    }

    if ((relOffset.left - eWidth) < 0) {
        newPosition = newPosition.replace('left', 'right');

    } else if ((relOffset.left + relWidth + eWidth) > wWidth) {
        newPosition = newPosition.replace('right', 'left');
    }

    if (position !== newPosition) {
        this.removeClass(position)
            .addClass(newPosition)
            .data('new-position', newPosition);

        position = newPosition;
    }

    // Shift around based on edge positioning
    var parts = position.split('-'),
        edge = { y: parts[0], x: parts[1] };

    if (edge.y === 'top') {
        offset.top -= eHeight;
    } else if (edge.y === 'bottom') {
        offset.top += relHeight;
    } else if (edge.y === 'center') {
        offset.top -= Math.round((eHeight / 2) - (relHeight / 2));
    }

    if (edge.x === 'left') {
        offset.left -= eWidth;
    } else if (edge.x === 'right') {
        offset.left += relWidth;
    } else if (edge.x === 'center') {
        offset.left -= Math.round((eWidth / 2) - (relWidth / 2));
    }

    // Increase the offset in case we are following the mouse cursor
    // We need to leave some padding for the literal cursor to not cause a flicker
    if (isMouse) {
        if (edge.y === 'center') {
            if (edge.x === 'left') {
                offset.left -= 15;
            } else if (edge.x === 'right') {
                offset.left += 15;
            }
        }

        if (edge.x === 'center') {
            if (edge.y === 'top') {
                offset.top -= 10;
            } else if (edge.y === 'bottom') {
                offset.top += 10;
            }
        }
    }

    return this.css(offset);
};

});