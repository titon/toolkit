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
    },

    /** Detect IE <= 8 versions */
    ie8: (window.attachEvent && !window.addEventListener),

    /** Detect IE9 version */
    ie9: (window.addEventListener && navigator.userAgent.match(/MSIE/i))
};

/**
 * Fetch the component instance from the jQuery collection.
 *
 * @param {String} component
 * @returns {Function}
 */
$.fn.toolkit = function(component) {
    var key = '$' + component,
        instance = null;

    this.each(function() {
        if (this[key]) {
            instance = this[key];
            return false;
        }

        return true;
    });

    return instance;
};

/**
 * Reveal the element by applying the show class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {jQuery}
 */
$.fn.reveal = function() {
    return this.removeClass('hide').addClass('show');
};

/**
 * Conceal the element by applying the hide class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {jQuery}
 */
$.fn.conceal = function() {
    return this.removeClass('show').addClass('hide');
};

/**
 * Position the element relative to another element in the document, or to the mouse cursor.
 * Determine the offsets through the `relativeTo` argument, which can be an event, or a jQuery element.
 * Optional account for mouse location and base offset coordinates.
 *
 * @param {String} position
 * @param {Event|jQuery} relativeTo
 * @param {Object} baseOffset
 * @param {bool} isMouse
 * @returns {jQuery}
 */
$.fn.positionTo = function(position, relativeTo, baseOffset, isMouse) {
    position = position.hyphenate().split('-');

    var edge = { y: position[0], x: position[1] },
        offset = baseOffset || { left: 0, top: 0 },
        relHeight = 0,
        relWidth = 0,
        eHeight = this.outerHeight(true),
        eWidth = this.outerWidth(true);

    // If an event is used, position it near the mouse
    if (relativeTo.preventDefault) {
        offset.left += relativeTo.pageX;
        offset.top += relativeTo.pageY;

    // Else position it near the element
    } else {
        var relOffset = relativeTo.offset();

        offset.left += relOffset.left;
        offset.top += relOffset.top;
        relHeight = relativeTo.outerHeight();
        relWidth = relativeTo.outerWidth();
    }

    // Shift around based on edge positioning
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
                offset.top += 20;
            }
        }
    }

    return this.css(offset);
};

/**
 * Delays the execution of a function till the duration has completed.
 *
 * @param {Function} func
 * @param {Number} [threshold]
 * @returns {Function}
 */
$.debounce = function(func, threshold) {
    var timeout;

    return function debounced() {
        var obj = this, args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(function delayed() {
            func.apply(obj, args);
            timeout = null;
        }, threshold || 150);
    };
};

/**
 * Throttle the execution of a function so it triggers at every delay interval.
 *
 * @param {Function} func
 * @param {Number} [delay]
 * @param {Array} [args]
 * @returns {Function}
 */
$.throttle = function(func, delay, args) {
    if (!func.$throttled){
        func.$throttled = setTimeout(function() {
            func.apply(this, args || []);
            func.$throttled = false;
        }, delay || 250);
    }

    return func;
};

/**
 * Used for CSS animations and transitions.
 *
 * @returns {bool}
 */
$.expr[':'].shown = function(obj) {
    return ($(obj).css('visibility') !== 'hidden');
};

/**
 * Split an array into multiple chunked arrays.
 *
 * @param {Number} size
 * @returns {Array}
 */
if (!Array.prototype.chunk) {
    Array.prototype.chunk = function(size) {
        var array = this, chunks = [],
            i = 0,
            n = array.length;

        while (i < n) {
            chunks.push(array.slice(i, i += size));
        }

        return chunks;
    };
}

/**
 * Convert uppercase characters to lower case dashes.
 *
 * @returns {String}
 */
if (!String.prototype.hyphenate) {
    String.prototype.hyphenate = function() {
        return this.replace(/[A-Z]/g, function(match) {
            return ('-' + match.charAt(0).toLowerCase());
        });
    };
}

/**
 * Very basic method for allowing functions to inherit functionality through the prototype.
 * Will set the prototype if the `base` function to the function calling `create()`.
 *
 * @returns {Function}
 */
if (!Function.prototype.create) {
    Function.prototype.create = function(base) {
        /*jshint newcap:false */
        base.prototype = new this();
        base.prototype.constructor = this;

        return base;
    };
}

/**
 * Polyfill for ECMA5 Function.bind().
 * Credit to the MooTools team for the implementation.
 *
 * @returns {Function}
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function(that) {
        var self = this,
            args = arguments.length > 1 ? [].slice.call(arguments, 1) : null,
            F = function(){};

        var bound = function() {
            var context = that,
                length = arguments.length;

            if (this instanceof bound){
                F.prototype = self.prototype;
                context = new F();
            }

            var result = (!args && !length) ? self.call(context) :
                self.apply(context, args && length ? args.concat([].slice.call(arguments)) : args || arguments);

            return (context === that) ? result : context;
        };

        return bound;
    };
}

})(window);
