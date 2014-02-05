/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function(window) {
    'use strict';

window.Toolkit = {

    /** Current version */
    version: '%version%',

    /** Build date hash */
    build: '%build%',

    /** Options */
    options: {
        vendor: '',
        isPrefix: 'is-',
        hasPrefix: 'has-'
    },

    /** Localization messages */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /** Does the browser support transforms? */
    hasTransform: (function() {
        var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
            style = document.createElement('div').style;

        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i] in style) {
                return prefixes[i];
            }
        }

        return false;
    })(),

    /** Does the browser support transitions? */
    hasTransition: (function() {
        var prefixes = 'transition WebkitTransition MozTransition OTransition msTransition'.split(' '),
            style = document.createElement('div').style;

        for (var i = 0; i < prefixes.length; i++) {
            if (prefixes[i] in style) {
                return prefixes[i];
            }
        }

        return false;
    })(),

    /** Detect touch devices */
    isTouch: !!('ontouchstart' in window)
};

/**
 * Fetch the component instance from the jQuery collection.
 *
 * @param {String} component
 * @returns {Array|Function}
 */
$.fn.toolkit = function(component) {
    var key = 'toolkit.' + component,
        data,
        instances = [];

    this.each(function() {
        if (data = $(this).data(key)) {
            instances.push( data );
        }
    });

    if (this.length === 1 && instances[0]) {
        return instances[0];
    }

    return instances;
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
 * Return a jQuery instance for the item in the collection defined by the index.
 *
 * @param {Number} index
 * @returns {jQuery}
 */
$.fn.i = $.fn.item = function(index) {
    var item = this.get(index);

    return item ? $(item) : null;
};

/**
 * Set data if the key does not exist, else return the current value.
 * If the value is a function, it will be executed to extract a value.
 *
 * @param {String} key
 * @param {*} value
 * @returns {*}
 */
$.fn.addData = function(key, value) {
    var data = this.data(key);

    if (data) {
        return data;

    } else if (typeof value === 'function') {
        value = value.call(this);
    }

    this.data(key, value);

    return value;
};

/**
 * An event that allows the clicking of the document to trigger a callback.
 * However, will only trigger if the element clicked is not in the exclude list or a child of.
 * Useful for closing dropdowns and menus.
 *
 * Based on and credited to http://benalman.com/news/2010/03/jquery-special-events/
 *
 * @returns {Object}
 */
jQuery.event.special.clickout = (function() {
    var elements = $([]),
        doc = $(document);

    function clickOut(e) {
        var trigger = true;

        elements.each(function() {
            if (trigger) {
                var self = $(this);

                trigger = (!self.is(e.target) && self.has(e.target).length === 0);
            }
        });

        if (trigger) {
            elements.trigger('clickout', [e.target]);
        }
    }

    return {
        setup: function() {
            elements = elements.add(this);

            if (elements.length === 1) {
                doc.on('click', clickOut);
            }
        },
        teardown: function() {
            elements = elements.not(this);

            if (elements.length === 0) {
                doc.off('click', clickOut);
            }
        },
        add: function(handler) {
            var oldHandler = handler.handler;

            handler.handler = function(e, el) {
                e.target = el;
                oldHandler.apply(this, arguments);
            };
        }
    };
})();

$.fn.clickout = function(data, fn) {
    return arguments.length > 0 ?
        this.on('clickout', null, data, fn) :
        this.trigger('clickout');
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
 * @param {bool} [immediate]
 * @returns {Function}
 */
$.debounce = function(func, threshold, immediate) {
    var timeout;

    return function() {
        var context = this, args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(function() {
            timeout = null;

            if (!immediate) {
                func.apply(context, args);
            }
        }, threshold || 150);

        if (immediate && !timeout)  {
            func.apply(context, args);
        }
    };
};

/**
 * Throttle the execution of a function so it triggers at every delay interval.
 *
 * @param {Function} func
 * @param {Number} [delay]
 * @returns {Function}
 */
$.throttle = function(func, delay) {
    var throttled = false;

    return function() {
        var context = this, args = arguments;

        if (!throttled) {
            throttled = true;

            setTimeout(function() {
                func.apply(context, args);
                throttled = false;
            }, delay || 150);
        }
    };
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
 *
 * @returns {Function}
 */
if (!Function.prototype.create) {
    Function.prototype.create = function(base) {
        // Extend the prototype else we'll run into weird shared inheritance bugs
        base.prototype = $.extend({}, this.prototype);
        base.prototype.constructor = base;

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
