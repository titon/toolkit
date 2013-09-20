/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function(window) {
    'use strict';

window.Titon = {

    /** Current version */
    version: '%version%',

    /** Build date hash */
    build: '%build%',

    /** Localization messages */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    }

};

/**
 * Prototype overrides.
 */
Element.implement({

    /**
     * Reveal the element by applying the show class.
     * Should be used to trigger transitions and animations.
     *
     * @returns {Element}
     */
    reveal: function() {
        return this.swapClass('hide', 'show');
    },

    /**
     * Conceal the element by applying the hide class.
     * Should be used to trigger transitions and animations.
     *
     * @returns {Element}
     */
    conceal: function() {
        return this.swapClass('show', 'hide');
    },

    /**
     * Used for animations. Do not conflict with isVisible() or isHidden().
     *
     * @returns {bool}
     */
    isShown: function() {
        return (this.getStyle('visibility') !== 'hidden');
    },

    /**
     * Position the element relative to another element in the document, or to the mouse cursor.
     * Determine the offsets through the `relativeTo` argument, which can be an event, or a jQuery element.
     * Optional account for mouse location and base offset coordinates.
     *
     * @param {String} position
     * @param {DOMEvent|Element} relativeTo
     * @param {Object} baseOffset
     * @param {bool} isMouse
     * @returns {Element}
     */
    positionTo: function(position, relativeTo, baseOffset, isMouse) {
        position = position.hyphenate().split('-');

        var edge = { y: position[0], x: position[1] },
            offset = baseOffset || { left: 0, top: 0 },
            relHeight = 0,
            relWidth = 0,
            eSize = this.getDimensions({
                computeSize: true,
                styles: ['padding', 'border', 'margin']
            });

        // If an event is used, position it near the mouse
        if (typeOf(relativeTo) === 'domevent') {
            offset.left += relativeTo.page.x;
            offset.top += relativeTo.page.y;

        // Else position it near the element
        } else {
            var relOffset = relativeTo.getPosition();

            offset.left += relOffset.x;
            offset.top += relOffset.y;
            relHeight = relativeTo.getHeight();
            relWidth = relativeTo.getWidth();
        }

        // Shift around based on edge positioning
        if (edge.y === 'top') {
            offset.top -= eSize.totalHeight;
        } else if (edge.y === 'bottom') {
            offset.top += relHeight;
        } else if (edge.y === 'center') {
            offset.top -= Math.round((eSize.totalHeight / 2) - (relHeight / 2));
        }

        if (edge.x === 'left') {
            offset.left -= eSize.totalWidth;
        } else if (edge.x === 'right') {
            offset.left += relWidth;
        } else if (edge.x === 'center') {
            offset.left -= Math.round((eSize.totalWidth / 2) - (relWidth / 2));
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
                    offset.top += 20;
                }
            }
        }

        return this.setStyles(offset);
    }

});

Array.implement({

    /**
     * Split an array into multiple chunked arrays.
     *
     * @param {Number} size
     * @returns {Array}
     */
    chunk: function(size) {
        var array = this;

        return [].concat.apply([], array.map(function(elem, i) {
            return (i % size) ? [] : [ array.slice(i, i + size) ];
        }));
    }

});

Function.implement({

    /**
     * Delays the execution of a function till the duration has completed.
     *
     * @param {Number} [threshold]
     * @returns {Function}
     */
    debouce: function(threshold) {
        var timeout, func = this;

        return function debounced() {
            var obj = this;

            function delayed() {
                func.apply(obj, arguments);
                timeout = null;
            }

            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(delayed, threshold || 150);
        };
    }

});

/**
 * Override the default HTML setter and allow element nodes to be used.
 */
Element.Properties.html.set = function(html) {
    var type = typeOf(html);

    // If we use get('html') it will only get the inner HTML
    // This approach will append the element itself
    if (type === 'element') {
        this.innerHTML = '';
        this.appendChild(html);

        return this;
    }

    if (type === 'string' && html.substr(0, 1) === '#') {
        html = document.getElement(html).get('html');

    } else if (type === 'array') {
        html = html.join('');
    }

    this.innerHTML = html;

    return this;
};

})(window);

