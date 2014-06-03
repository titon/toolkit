/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

// Component instances indexed by the selector that activated it
var instances = {};

// Check if transitions exist
var hasTransition = (function() {
    var prefixes = 'transition WebkitTransition MozTransition OTransition msTransition'.split(' '),
        style = document.createElement('div').style;

    for (var i = 0; i < prefixes.length; i++) {
        if (prefixes[i] in style) {
            return prefixes[i];
        }
    }

    return false;
})();

// Toolkit namespace
var Toolkit = {

    /** Current version */
    version: '%version%',

    /** Build date hash */
    build: '%build%',

    /** Vendor namespace */
    vendor: '',

    /** ARIA support */
    aria: true,

    /** Localization messages */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /** Does the browser support transitions? */
    hasTransition: hasTransition,

    /** Event name for transition end */
    transitionEnd: (function() {
        var eventMap = {
            WebkitTransition: 'webkitTransitionEnd',
            OTransition: 'oTransitionEnd otransitionend'
        };

        return eventMap[hasTransition] || 'transitionend';
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
    create: function(component, callback, collection) {
        var name = component;

        // Prefix with toolkit to avoid collisions
        if ($.fn[name]) {
            name = 'toolkit' + name.charAt(0).toUpperCase() + name.slice(1);
        }

        $.fn[name] = collection ?

            // Apply the instance to a collection of elements
            function() {
                var instance = instances[component + '.' + this.selector] = callback.apply(this, arguments);

                return this.each(function() {
                    $(this).addData('toolkit.' + component, instance);
                });
            } :

            // Apply the instance per element
            function() {
                var args = arguments;

                return this.each(function() {
                    $(this).addData('toolkit.' + component, callback.apply(this, args));
                });
            };
    },

    /**
     * Empty class to inherit from.
     */
    Class: function() {}

};

// Make it available
window.Toolkit = Toolkit;

// Dereference these variables to lower the filesize
var vendor = Toolkit.vendor;

/**
 * Very basic method for allowing functions to inherit functionality through the prototype.
 *
 * @param {Function} base
 * @param {Object} properties
 * @param {Object} options
 * @returns {Function}
 */
Toolkit.Class.extend = function(base, properties, options) {
    var Class = function() {
        // Bind all methods with the class context
        // - Allows event listeners to work automatically without having to bind() them
        // - Fixes issues with bindEvents() where events cant be turned off
        for (var key in this) {
            if (typeof this[key] === 'function') {
                this[key] = this[key].bind(this);
            }
        }

        // Set the UID and increase global count
        this.uid = Class.count += 1;

        // Trigger constructor
        base.apply(this, arguments);
    };

    // Inherit the prototype and merge properties
    $.extend(Class.prototype, this.prototype, properties || {});

    // Inherit and set default options
    Class.options = $.extend(true, {}, this.options || {}, options || {});

    // Inherit the extend method
    Class.extend = this.extend;

    // Count of total instances
    Class.count = 0;

    // Use base as constructor
    Class.prototype.constructor = base;

    return Class;
};

/**
 * Fetch the component instance from the jQuery collection.
 * If a method and arguments are defined, trigger a method on the instance.
 *
 * @param {String} component
 * @param {String} [method]
 * @param {Array} [args]
 * @returns {Function}
 */
$.fn.toolkit = function(component, method, args) {
    var selector = this.selector,
        instance = this.data('toolkit.' + component);

    // Check for the instance within the cache
    if (!instance && instances[component + '.' + selector]) {
        instance = instances[component + '.' + selector];
    }

    if (!instance) {
        return null;
    }

    // Trigger a method on the instance of method is defined
    if (method && instance[method]) {
        instance[method].apply(instance, $.makeArray(args));
    }

    return instance;
};

/**
 * Reveal the element by applying the show class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {jQuery}
 */
$.fn.reveal = function() {
    return this
        .removeClass('hide')
        .addClass('show')
        .aria('hidden', false);
};

/**
 * Conceal the element by applying the hide class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {jQuery}
 */
$.fn.conceal = function() {
    return this
        .removeClass('show')
        .addClass('hide')
        .aria('hidden', true);
};

/**
 * A multi-purpose getter and setter for ARIA attributes.
 * Will prefix attribute names and cast values correctly.
 *
 * @param {Element} element
 * @param {String|Object} key
 * @param {*} value
 */
function doAria(element, key, value) {
    if (value === true) {
        value = 'true';
    } else if (value === false) {
        value = 'false';
    }

    element.setAttribute('aria-' + key, value);
}

$.fn.aria = function(key, value) {
    if (!Toolkit.aria) {
        return this;
    }

    if (key === 'toggled') {
        key = { expanded: value, selected: value };
        value = null;
    }

    return $.access(this, doAria, key, value, arguments.length > 1);
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
 * Re-position the element if its target coordinates fall outside of the viewport.
 * Optionally account for mouse location and base offset coordinates.
 *
 * @param {String} position
 * @param {Event|jQuery} relativeTo
 * @param {Object} baseOffset
 * @param {bool} isMouse
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

/**
 * Set a `transitionend` event. If the element has no transition set, trigger the callback immediately.
 *
 * @param {Object} data
 * @param {Function} fn
 * @returns {jQuery}
 */
$.fn.transitionend = function(data, fn) {
    var name = Toolkit.transitionEnd;

    if (arguments.length > 0) {
        this.one(name, null, data, fn);

        // No transition defined so trigger callback immediately
        var duration = this.css("transition-duration");

        if (duration === "0s" || typeof duration === 'undefined') {
            this.trigger(name);
        }
    } else {
        this.trigger(name);
    }

    return this;
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
    if (!delay) {
        return func;
    }

    var throttled = false;

    return function() {
        var context = this, args = arguments;

        if (!throttled) {
            throttled = true;

            setTimeout(function() {
                func.apply(context, args);
                throttled = false;
            }, delay);
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
 * Bound a number between a min and max range.
 *
 * @param {Number} value
 * @param {Number} max
 * @param {Number} min
 * @returns {Number}
 */
$.bound = function(value, max, min) {
    min = min || 0;

    if (value >= max) {
        value = 0;
    } else if (value < min) {
        value = max - 1;
    }

    return value;
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
        options = options || {};
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
        var elements = [];

        $(document).on('click.toolkit.out', function(e) {
            if (!elements.length) {
                return;
            }

            var trigger = true,
                collection = $(document),
                target = $(e.target);

            $.each(elements, function(i, item) {
                var self = $(item);

                // Test that the delegated selector class matches
                if ($.type(item) === 'string') {
                    trigger = (!target.is(item) && !self.has(e.target).length);

                // Else test if the element matches
                } else {
                    trigger = (!self.is(e.target) && !self.has(e.target).length);
                }

                if (trigger) {
                    collection = collection.add(self);
                } else {
                    return false;
                }
            });

            if (trigger) {
                collection.trigger('clickout', [e.target]);
            }
        });

        return {
            add: function(handler) {
                var context = this;

                if (this === document) {
                    context = handler.selector;
                }

                if ($.inArray(context, elements) === -1) {
                    elements.push(context);
                }
            },
            remove: function(handler) {
                var context = this;

                if (this === document) {
                    context = handler.selector;
                }

                elements = $.grep(elements, function(item) {
                    return (item !== context);
                });
            }
        };
    })();
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
            stopEvent = isTouch ? 'touchend' : 'mouseup',
            swiping = false, // Flag For ensuring a single swipe at a time
            abs = Math.abs;

        function coords(e) {
            var data = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;

            return {
                time: (new Date()).getTime(),
                x: data.pageX,
                y: data.pageY
            };
        }

        function swipe(start, stop, selfTarget, origTarget) {
            if (!start || !stop) {
                return;
            }

            var settings = $.event.special.swipe,
                x = stop.x - start.x,
                y = stop.y - start.y,
                direction;

            if ((stop.time - start.time) <= settings.duration) {
                if (abs(x) >= settings.distance && abs(y) <= settings.restraint) {
                    direction = (x < 0) ? 'left' : 'right';

                } else if (abs(y) >= settings.distance && abs(x) <= settings.restraint) {
                    direction = (y < 0) ? 'up' : 'down';

                } else {
                    return;
                }

                var props = {
                    target: origTarget,
                    swipestart: start,
                    swipestop: stop
                };

                selfTarget
                    .trigger($.Event('swipe', props))
                    .trigger($.Event('swipe' + direction, props));
            }
        }

        return {
            duration: 1000, // Maximum time in milliseconds to travel
            distance: 50,   // Minimum distance required to travel
            restraint: 75,  // Maximum distance to travel in the opposite direction

            setup: function() {
                var self = $(this),
                    start,
                    target;

                /**
                 * There's a major bug in Android devices where `touchend` events do not fire
                 * without calling `preventDefault()` in `touchstart` or `touchmove`.
                 * Because of this, we have to hack-ily implement functionality into `touchmove`.
                 * We also can't use `touchcancel` as that fires prematurely and unbinds our move event.
                 * More information on these bugs can be found here:
                 *
                 * https://code.google.com/p/android/issues/detail?id=19827
                 * https://code.google.com/p/chromium/issues/detail?id=260732
                 *
                 * Using `touchcancel` is also rather unpredictable, as described here:
                 *
                 * http://alxgbsn.co.uk/2011/12/23/different-ways-to-trigger-touchcancel-in-mobile-browsers/
                 */
                function move(e) {
                    var to = coords(e);

                    // Trigger `preventDefault()` if `x` is larger than `y` (scrolling horizontally).
                    // If we `preventDefault()` while scrolling vertically, the window will not scroll.
                    if (abs(start.x - to.x) > abs(start.y - to.y)) {
                        e.preventDefault();
                    }
                }

                /**
                 * When `touchend` or `touchcancel` is triggered, clean up the swipe state.
                 * Also unbind `touchmove` events until another swipe occurs.
                 */
                function cleanup() {
                    start = target = null;
                    swiping = false;

                    self.off(moveEvent, move);
                }

                // Initialize the state when a touch occurs
                self.on(startEvent, function(e) {

                    // Calling `preventDefault()` on start will disable clicking of elements (links, inputs, etc)
                    // So only do it on an `img` element so it cannot be dragged
                    if (!isTouch && e.target.tagName.toLowerCase() === 'img') {
                        e.preventDefault();
                    }

                    // Exit early if another swipe is occurring
                    if (swiping) {
                        return;
                    }

                    start = coords(e);
                    target = e.target;
                    swiping = true;

                    // Non-touch devices don't make use of the move event
                    if (isTouch) {
                        self.on(moveEvent, move);
                    }
                });

                // Trigger the swipe event when the touch finishes
                self.on(stopEvent, function(e) {
                    swipe(start, coords(e), self, target);
                    cleanup();
                });

                // Reset the state when the touch is cancelled
                self.on('touchcancel', cleanup);
            },

            teardown: function() {
                $(this).off(startEvent).off(moveEvent).off(stopEvent).off('touchcancel');
            }
        };
    })();

    // Set swipe methods and events
    $.each('swipe swipeleft swiperight swipeup swipedown'.split(' '), function(i, name) {
        if (name !== 'swipe') {
            $.event.special[name] = {
                setup: function() {
                    $(this).on('swipe', $.noop);
                },
                teardown: function() {
                    $(this).off('swipe');
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