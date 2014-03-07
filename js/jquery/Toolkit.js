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
    isTouch: !!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)),

    /** Detect retina displays */
    isRetina: (window.devicePixelRatio > 1),

    /**
     * Creates a jQuery plugin by extending the jQuery prototype and defines a method
     * that initializes a component. The component is only initialized if one has not been already.
     * Components are either defined per element, or on a collection of elements.
     *
     * @param {String} component
     * @param {Function} callback
     * @param {bool} collection
     */
    createComponent: function(component, callback, collection) {
        var name = component;

        // Prefix with toolkit to avoid collisions
        if ($.fn[name]) {
            name = 'toolkit' + name.charAt(0).toUpperCase() + name.slice(1);
        }

        $.fn[name] = collection ?

            // Apply the instance to a collection of elements
            function() {
                var instance = callback.apply(this, arguments);

                return this.each(function() {
                    $(this).addData('toolkit.' + component, instance);
                });
            } :

            // Apply the instance per element
            function() {
                var args = arguments;

                return this.each(function() {
                    var self = this;

                    $(this).addData('toolkit.' + component, (function() {
                        return function() {
                            return callback.apply(self, args);
                        };
                    })());
                });
            };
    },

    /**
     * Empty class to inherit from.
     */
    Class: function() {}

};

/**
 * Very basic method for allowing functions to inherit functionality through the prototype.
 *
 * @param {Function} base
 * @param {Object} properties
 * @param {Object} options
 * @returns {Function}
 */
Toolkit.Class.extend = function(base, properties, options) {
    $.extend(base.prototype, this.prototype, properties);

    // Use function as constructor
    base.prototype.constructor = base;

    // Set default options
    base.options = options || {};

    // Inherit the extend method
    base.extend = this.extend;

    return base;
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
    position = $.hyphenate(position).split('-');

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
 * Convert uppercase characters to lower case dashes.
 *
 * @param {String} string
 * @returns {String}
 */
$.hyphenate = function(string) {
    return string.replace(/[A-Z]/g, function(match) {
        return ('-' + match.charAt(0).toLowerCase());
    });
};

/**
 * A very lightweight implementation for cookie management.
 * Will only define if $.cookie() does not exist, which will allow for other third-party code.
 *
 * @link https://github.com/carhartl/jquery-cookie
 */
if (!$.cookie) {

    /**
     * Set a cookie.
     *
     * @param {String} key
     * @param {*} value
     * @param {Object} options
     * @returns {*}
     */
    $.cookie = function(key, value, options) {
        options = $.extend({
            expires: null,
            path: '/',
            domain: '',
            secure: false
        }, options);

        // Set
        if (typeof value !== 'undefined') {
            if (typeof options.expires === 'number') {
                var date = new Date();
                    date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);

                options.expires = date.toUTCString();
            }

            return (document.cookie = [
                key + '=' + encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires : '',
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));

        // Get
        } else {
            value = document.cookie.match('(?:^|;)\\s*' + key.replace(/[\-\.\+\*]/g, '\\$&') + '=([^;]*)');

            if (value && value.length) {
                return decodeURIComponent(value[1]);
            }
        }

        return null;
    };

    /**
     * Remove a cookie by key.
     *
     * @param {String} key
     * @param {Object} options
     * @returns {bool}
     */
    $.removeCookie = function(key, options) {
        options.expires = -1;

        return $.cookie(key, '', options);
    };
}

/**
 * An event that allows the clicking of the document to trigger a callback.
 * However, will only trigger if the element clicked is not in the exclude list or a child of.
 * Useful for closing drop downs and menus.
 *
 * Based on and credited to http://benalman.com/news/2010/03/jquery-special-events/
 *
 * @returns {Object}
 */
if (!$.event.special.clickout) {
    $.event.special.clickout = (function() {
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
}

/**
 * An event that triggers when a swipe event occurs over a target element.
 * Uses touch events for touch devices, and mouse events for non-touch devices.
 *
 * Implementation is a heavily modified version of the swipe events found in jQuery Mobile.
 * Credits to the jQuery team for the original implementation.
 *
 * @returns {Object}
 */
if (!$.event.special.swipe) {
    $.event.special.swipe = (function() {
        var isTouch = Toolkit.isTouch,
            startEvent = isTouch ? 'touchstart' : 'mousedown',
            moveEvent = isTouch ? 'touchmove' : 'mousemove',
            stopEvent = isTouch ? 'touchend' : 'mouseup';

        function startStop(e) {
            var data = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;

            return {
                time: (new Date()).getTime(),
                coords: [ data.pageX, data.pageY ]
            };
        }

        function swipe(start, stop, selfTarget, origTarget) {
            var settings = $.event.special.swipe,
                abs = Math.abs,
                x = stop.coords[0] - start.coords[0],
                y = stop.coords[1] - start.coords[1],
                direction;

            if ((stop.time - start.time) <= settings.duration) {
                if (abs(x) >= settings.distance && abs(y) <= settings.restraint) {
                    direction = (x < 0) ? 'left' : 'right';

                } else if (abs(y) >= settings.distance && abs(x) <= settings.restraint) {
                    direction = (y < 0) ? 'up' : 'down';

                } else {
                    return;
                }

                var props = { target: origTarget, swipestart: start, swipestop: stop };

                selfTarget
                    .trigger($.Event('swipe', props))
                    .trigger($.Event('swipe' + direction, props));
            }
        }

        return {
            duration: 1000, // Maximum time in milliseconds to travel
            distance: 50, // Minimum distance required to travel
            restraint: 75, // Maximum distance to travel in the opposite direction

            setup: function() {
                var self = $(this),
                    start,
                    target;

                self
                    .bind(startEvent, function(e) {
                        start = startStop(e);
                        target = e.target;

                        if (startEvent === 'mousedown') {
                            e.preventDefault();
                        }
                    })
                    .bind(moveEvent, function(e) {
                        e.preventDefault();
                    })
                    .bind(stopEvent, function(e) {
                        swipe(start, startStop(e), self, target);
                    });
            },

            teardown: function() {
                $(this).unbind(startEvent).unbind(moveEvent).unbind(stopEvent);
            }
        };
    })();

    // Set swipe methods and events
    $.each('swipe swipeleft swiperight swipeup swipedown'.split(' '), function(i, name) {
        $.fn[name] = function(data, fn) {
            return arguments.length > 0 ?
                this.on(name, null, data, fn) :
                this.trigger(name);
        };

        if (name !== 'swipe') {
            $.event.special[name] = {
                setup: function() {
                    $(this).bind('swipe', $.noop);
                },
                teardown: function() {
                    $(this).unbind('swipe');
                }
            };
        }
    });
}

/**
 * Polyfill for ECMA5 Function.bind().
 * Credit to the MDN team for the implementation.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 *
 * @returns {Function}
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function(context) {
        var self = this,
            args = [].slice.call(arguments, 1),
            Func = function() {},
            bound = function() {
                return self.apply(
                    (this instanceof Func && context) ? this : context,
                    args.concat([].slice.call(arguments))
                );
            };

        Func.prototype = this.prototype;
        bound.prototype = new Func();

        return bound;
    };
}

})(window);
