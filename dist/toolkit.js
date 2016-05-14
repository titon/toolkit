/*! Titon Toolkit v2.1.9 | BSD-3-Clause | titon.io */
(function($, window, document) {
'use strict';
    // Include an empty jQuery file so that we can setup local dependencies
    // It also allows the files to be included externally in other projects

// Does the device support touch controls
var isTouch = !!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch));

// Does the device support retina display
var isRetina = (window.devicePixelRatio > 1);

// Is the HTML document currently set to RTL mode?
var isRTL = (document.documentElement.dir === 'rtl');

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

// Store the event name in a variable
var transitionEnd = (function() {
    var eventMap = {
        WebkitTransition: 'webkitTransitionEnd',
        OTransition: 'oTransitionEnd otransitionend'
    };

    return eventMap[hasTransition] || 'transitionend';
})();

/**
 * Set data if the key does not exist, else return the current value.
 * If the value is a function, it will be executed to extract a value.
 *
 * @param {String} key
 * @param {*} [value]
 * @returns {*}
 */
$.fn.cache = function(key, value) {
    var data = this.data(key),
        type = $.type(data);

    if (type !== 'undefined' && type !== 'null') {
        return data;

    } else if ($.type(value) === 'function') {
        value = value.call(this);
    }

    this.data(key, value);

    return value;
};

var Toolkit = {

    /** Current version. */
    version: '2.1.9',

    /** Build date hash. */
    build: 'io7pvxnb',

    /** CSS namespace. */
    namespace: '',

    /** ARIA support. */
    aria: true,

    /** Global debugging. */
    debug: false,

    /** Localization messages. */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /** BEM class name separators. */
    bemSeparators: ['-', '--'],

    /** Does the browser support transitions? */
    hasTransition: hasTransition,

    /** Detect touch devices. */
    isTouch: isTouch,

    /** Detect retina displays. */
    isRetina: isRetina,

    /** Detect right-to-left support. */
    isRTL: isRTL,

    /** Name of the `transitionend` event. */
    transitionEnd: transitionEnd,

    /** Plugin instances indexed by the selector that activated it. */
    cache: {},

    /**
     * Generate a BEM (block-element-modifier) valid CSS class name.
     *
     * @param {String} block
     * @param {String} [element]
     * @param {String} [modifier]
     * @returns {String}
     */
    bem: function(block, element, modifier) {
        var seps = Toolkit.bemSeparators;

        if (element) {
            block += seps[0] + element;
        }

        if (modifier) {
            block += seps[1] + modifier;
        }

        return Toolkit.namespace + block;
    },

    /**
     * Parse a value and convert it to a template string.
     * If the template is a function, execute it and pass the `bem()` function,
     * and the current namespace as arguments.
     *
     * @param {String|Function} template
     * @returns {String}
     */
    buildTemplate: function(template) {
        if (typeof template === 'function') {
            template = template.call(null, Toolkit.bem, Toolkit.namespace);
        }

        return template + '';
    },

    /**
     * Creates a jQuery plugin by extending the jQuery prototype with a method definition.
     * The Toolkit plugin is only initialized if one has not been already.
     * Plugins are either defined per element, or on a collection of elements.
     *
     * @param {String} plugin
     * @param {Function} callback
     * @param {bool} [collection]
     */
    createPlugin: function(plugin, callback, collection) {
        var name = plugin;

        // Prefix with toolkit to avoid collisions
        if ($.fn[name]) {
            name = 'toolkit' + name.charAt(0).toUpperCase() + name.slice(1);
        }

        $.fn[name] = collection ?

            // Apply the instance to a collection of elements
            function() {
                var instance = Toolkit.cache[plugin + ':' + this.selector] = callback.apply(this, arguments);

                return this.each(function() {
                    $(this).cache('toolkit.' + plugin, instance);
                });
            } :

            // Apply the instance per element
            function() {
                var args = arguments;

                return this.each(function() {
                    $(this).cache('toolkit.' + plugin, callback.apply(this, args));
                });
            };
    }

};

// Make it available
window.Toolkit = Toolkit;

// Empty class to extend from
var Class = Toolkit.Class = function() {};

// Flag to determine if a constructor is initializing
var constructing = false;

/**
 * Very basic method for allowing functions to inherit functionality through the prototype.
 *
 * @param {Object} properties
 * @param {Object} options
 * @returns {Function}
 */
Class.extend = function(properties, options) {
    constructing = true;
    var prototype = new this();
    constructing = false;

    // Inherit the prototype and merge properties
    $.extend(prototype, properties);

    // Fetch the constructor function before setting the prototype
    var constructor = prototype.constructor;

    // Class interface
    function Class() {

        // Exit constructing if being applied as prototype
        if (constructing) {
            return;
        }

        // Reset (clone) the array and object properties else they will be referenced between instances
        for (var key in this) {
            var value = this[key],
                type = $.type(value);

            if (type === 'array') {
                this[key] = value.slice(0); // Clone array

            } else if (type === 'object') {
                this[key] = $.extend(true, {}, value); // Clone object
            }
        }

        // Set the UID and increase global count
        this.uid = Class.count += 1;

        // Generate the CSS class name and attribute/event name based off the plugin name
        var name = this.name;

        if (name) {
            this.cssClass = name.replace(/[A-Z]/g, function(match) {
                return ('-' + match.charAt(0).toLowerCase());
            }).slice(1);

            // Generate an attribute and event key name based off the plugin name
            this.keyName = name.charAt(0).toLowerCase() + name.slice(1);
        }

        // Trigger constructor
        if (constructor) {
            constructor.apply(this, arguments);
        }
    }

    // Inherit the prototype
    Class.prototype = prototype;
    Class.prototype.constructor = constructor || Class;

    // Inherit and set default options
    Class.options = $.extend(true, {}, this.options || {}, options || {});

    // Inherit the extend method
    Class.extend = this.extend;

    // Count of total instances
    Class.count = 0;

    return Class;
};

var Base = Toolkit.Base = Class.extend({

    /** Name of the plugin. Must match the object declaration. */
    name: 'Base',

    /** Current version of the plugin. */
    version: '2.0.0',

    /** Cached data and AJAX requests. */
    cache: {},

    /** Is the plugin enabled? */
    enabled: false,

    /** Static options defined during construction. */
    options: {},

    /** Events and functions to bind. */
    __events: [],

    /** List of hooks grouped by type. */
    __hooks: {},

    /**
     * Add an event to bind.
     *
     * @param {String} event
     * @param {String} context
     * @param {String|Function} callback
     * @param {String} selector
     */
    addEvent: function(event, context, callback, selector) {
        var options = this.options;

        // Replace tokens
        if (event === '{mode}') {
            event = options.mode;
        }

        if (selector === '{selector}') {
            selector = this.nodes ? this.nodes.selector : '';
        }

        // Find and bind the function
        if ($.type(callback) === 'string') {
            callback = this[callback].bind(this);
        }

        this.__events.push([event, context, callback, selector]);
    },

    /**
     * Add multiple events.
     *
     * @param {Array} events
     */
    addEvents: function(events) {
        $.each(events, function(i, event) {
            this.addEvent.apply(this, event);
        }.bind(this));
    },

    /**
     * Add a hook to a specific event type.
     *
     * @param {String} type
     * @param {Function} callback
     */
    addHook: function(type, callback) {
        var list = this.__hooks[type] || [];
            list.push(callback);

        this.__hooks[type] = list;
    },

    /**
     * Add multiple hooks for a type.
     *
     * @param {String} type
     * @param {Array} callbacks
     */
    addHooks: function(type, callbacks) {
        $.each(callbacks, function(i, callback) {
            this.addHook(type, callback);
        }.bind(this));
    },

    /**
     * Loop through the events object and attach events to the specified selector in the correct context.
     * Take into account window, document, and delegation.
     *
     * @param {String} type
     */
    bindEvents: function(type) {
        var self = this,
            event,
            context,
            func,
            selector,
            win = $(window),
            doc = $(document);

        $.each(this.__events, function(i, value) {
            event = value[0];
            context = value[1];
            func = value[2];
            selector = value[3];

            // Determine the correct context
            if (self[context]) {
                context = self[context];

            } else if (context === 'window') {
                context = win;

            } else if (context === 'document') {
                context = doc;
            }

            // Ready events
            if (event === 'ready') {
                doc.ready(func);

            // Delegated events
            } else if (selector) {
                $(context)[type](event, selector, func);

            // Regular events
            } else {
                $(context)[type](event, func);
            }
        });
    },

    /**
     * Destroy the plugin by disabling events, removing elements, and deleting the instance.
     */
    destroy: function() {
        this.fireEvent('destroying');

        // Trigger child destructor
        if (this.destructor) {
            this.destructor();
        }

        // Trigger base destructor
        if (this.doDestroy) {
            this.doDestroy();
        }

        // Remove events
        this.disable();

        this.fireEvent('destroyed');
    },

    /**
     * Disable the plugin.
     */
    disable: function() {
        if (this.enabled) {
            this.bindEvents('off');
        }

        this.enabled = false;
    },

    /**
     * Enable the plugin.
     */
    enable: function() {
        if (!this.enabled) {
            this.bindEvents('on');
        }

        this.enabled = true;
    },

    /**
     * Trigger all hooks defined by type.
     *
     * @param {String} type
     * @param {Array} [args]
     */
    fireEvent: function(type, args) {
        var debug = this.options.debug || Toolkit.debug;

        if (debug) {
            console.log(this.name + '#' + this.uid, new Date().getMilliseconds(), type, args || []);

            if (debug === 'verbose') {
                console.dir(this);
            }
        }

        var hooks = this.__hooks[type];

        if (hooks) {
            $.each(hooks, function(i, hook) {
                hook.apply(this, args || []);
            }.bind(this));
        }
    },

    /**
     * Enable events and trigger `init` hooks.
     */
    initialize: function() {
        this.enable();
        this.fireEvent('init');
    },

    /**
     * Remove a hook within a type. If the callback is not provided, remove all hooks in that type.
     *
     * @param {String} type
     * @param {Function} [callback]
     */
    removeHook: function(type, callback) {
        if (!callback) {
            delete this.__hooks[type];
            return;
        }

        var hooks = this.__hooks[type];

        if (hooks) {
            $.each(hooks, function(i, hook) {
                if (hook === callback) {
                    hooks = hooks.splice(i, 1);
                }
            });
        }
    },

    /**
     * Set the options by merging with defaults. If the `responsive` option exists,
     * attempt to alter the options based on media query breakpoints. Furthermore,
     * if an option begins with `on`, add it as a hook.
     *
     * @param {Object} [options]
     * @returns {Object}
     */
    setOptions: function(options) {
        var opts = $.extend(true, {}, Toolkit[this.name].options, options || {}),
            key;

        // Inherit options based on responsive media queries
        if (opts.responsive && window.matchMedia) {
            $.each(opts.responsive, function(key, resOpts) {
                if (matchMedia(resOpts.breakpoint).matches) {
                    $.extend(opts, resOpts);
                }
            });
        }

        // Set hooks that start with `on`
        for (key in opts) {
            if (key.match(/^on[A-Z]/)) {
                this.addHook(key.substr(2).toLowerCase(), opts[key]);

                delete opts[key];
            }
        }

        this.options = opts;

        return opts;
    }

}, {
    cache: true,
    debug: false
});

/**
 * A multi-purpose getter and setter for ARIA attributes.
 * Will prefix attribute names and cast values correctly.
 *
 * @param {Element} element
 * @param {String|Object} key
 * @param {*} value
 */
function setAriaValue(value) {
    if (value === true) {
        value = 'true';
    } else if (value === false) {
        value = 'false';
    }

    return value;
}

$.fn.aria = function(key, value) {
    if (!Toolkit.aria) {
        return this;
    }

    if (key === 'toggled') {
        key = { expanded: value, selected: value };
        value = undefined;
    }

    // Multi-setter
    if ($.type(key) === 'object') {
        Object.keys(key).forEach(function(k) {
            this.attr('aria-' + k, setAriaValue(key[k]));
        }.bind(this));

        return this;

    // Setter
    } else if ($.type(value) !== 'undefined') {
        this.attr('aria-' + key, setAriaValue(value));

        return this;
    }

    // Getter
    return this.attr('aria-' + key);
};

/**
 * Set a `transitionend` event. If the element has no transition set, trigger the callback immediately.
 *
 * @param {Object} data
 * @param {Function} [fn]
 * @returns {jQuery}
 */
$.fn.transitionend = function(data, fn) {
    if (arguments.length > 0) {
        this.one(transitionEnd, null, data, fn);

        // No transition defined so trigger callback immediately
        var duration = this.css("transition-duration");

        if (duration === "0s" || $.type(duration) === 'undefined') {
            this.trigger(transitionEnd);
        }
    } else {
        this.trigger(transitionEnd);
    }

    return this;
};

/**
 * Conceal the element by applying the hide class.
 * Should be used to trigger transitions and animations.
 *
 * @param {bool} [dontHide]
 * @returns {jQuery}
 */
$.fn.conceal = function(dontHide) {
    if (this.hasClass('show') && !dontHide) {
        this.transitionend(function() {
            $(this).hide();
        });
    }

    return this
        .removeClass('show')
        .addClass('hide')
        .aria('hidden', true);
};

/**
 * Reveal the element by applying the show class.
 * Should be used to trigger transitions and animations.
 *
 * @param {bool} [dontShow]
 * @returns {jQuery}
 */
$.fn.reveal = function(dontShow) {
    if (!dontShow) {
        this.show();
    }

    // We must place in a timeout or transitions do not occur
    setTimeout(function() {
        this.removeClass('hide')
            .addClass('show')
            .aria('hidden', false);
    }.bind(this), 1);

    return this;
};

/**
 * Fetch the plugin instance from the jQuery collection.
 * If a method and arguments are defined, trigger a method on the instance.
 *
 * @param {String} plugin
 * @param {String} [method]
 * @param {Array} [args]
 * @returns {Function}
 */
$.fn.toolkit = function(plugin, method, args) {
    var selector = this.selector,
        instance = this.data('toolkit.' + plugin) || Toolkit.cache[plugin + ':' + selector] || null;

    if (!instance) {
        return null;
    }

    // Trigger a method on the instance of method is defined
    if (method && instance[method]) {
        instance[method].apply(instance, $.makeArray(args));
    }

    return instance;
};

var Component = Toolkit.Component = Base.extend({
    name: 'Component',
    version: '2.1.6',

    /** The target element. Either the embedded element, or the current element in the composite layer. */
    element: null,

    /** The namespace to find child elements in. */
    namespace: '',

    /** The element that activated the component. */
    node: null,

    /**
     * A basic constructor that sets an element and its options.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        this.setElement(element);
        this.setOptions(options, this.element);
    },

    /**
     * Trigger all hooks and any DOM events attached to the `element` or `node`.
     *
     * @param {String} type
     * @param {Array} [args]
     */
    fireEvent: function(type, args) {
        Base.prototype.fireEvent.call(this, type, args);

        var element = this.element,
            node = this.node,
            event = $.Event(type + '.toolkit.' + this.keyName);
            event.context = this;

        // Trigger event on the element and the node
        if (element) {
            element.trigger(event, args || []);
        }

        if (node) {
            node.trigger(event, args || []);
        }
    },

    /**
     * Hide the primary element.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.element.conceal();

        this.fireEvent('hidden');
    },

    /**
     * Generate a unique CSS class name for the component and its arguments.
     *
     * @returns {String}
     */
    id: function() {
        var list = $.makeArray(arguments);
            list.unshift('toolkit', this.cssClass, this.uid);

        return list.join('-');
    },

    /**
     * Inherit options from the target elements data attributes.
     *
     * @param {Object} options
     * @param {jQuery} element
     * @returns {Object}
     */
    inheritOptions: function(options, element) {
        var key, value, obj = {};

        for (key in options) {
            if (key === 'context' || key === 'template') {
                continue;
            }

            value = element.data((this.keyName + '-' + key).toLowerCase());

            if ($.type(value) !== 'undefined') {
                obj[key] = value;
            }
        }

        return $.extend(true, {}, options, obj);
    },

    /**
     * Attempt to load content from different formats and set it using `position()`.
     * If the content is an element ID (#hash), fetch the inner contents from the element.
     * If the content is a string that looks like an absolute URL, fetch the content using an AJAX request.
     * If the content is a literal string or an element, set it directly.
     *
     * @param {String|HTMLElement} content
     * @param {Object} [params]
     */
    loadContent: function(content, params) {
        var cacheKey = content;

        if (typeof content === 'string') {

            // Load content from an element matching ID
            if (content.match(/^#[a-z0-9_\-\.:]+$/i)) {
                if (this.cache[cacheKey]) {
                    content = this.cache[cacheKey];
                } else {
                    content = this.cache[cacheKey] = $(content).html();
                }

            // Load content from an AJAX request
            // Matches http://, https://, /url, and many others
            } else if (content.match(/^([a-z]+:)?\/\//) || content.match(/^\/[\w\-\.\/]+/i)) {
                if (this.cache[cacheKey]) {
                    content = this.cache[cacheKey];
                } else {
                    this.requestData(content, params);
                    return;
                }
            }
        }

        this.position(content);
    },

    /**
     * Generate a valid data attribute selector based on the current component name and namespace.
     *
     * @param {String} [element]
     * @param {String} [block]
     * @returns {string}
     */
    ns: function(element, block) {
        var selector = 'data-' + (block || this.keyName);

        if (element) {
            selector += '-' + element;
        }

        if (this.namespace) {
            selector += '="' + this.namespace + '"';
        }

        return '[' + selector + ']';
    },

    /**
     * Handle and process HTML responses.
     *
     * @param {*} content
     */
    position: function(content) {
        this.fireEvent('load', [content]);
    },

    /**
     * Handle and process non-HTML responses.
     *
     * @param {*} content
     */
    process: function(content) {
        if (content.callback) {
            var namespaces = content.callback.split('.'),
                func = window, prev = func;

            for (var i = 0; i < namespaces.length; i++) {
                prev = func;
                func = func[namespaces[i]];
            }

            func.call(prev, content);
        }

        this.fireEvent('process', [content]);

        this.hide();
    },

    /**
     * Read a class option from a data attribute.
     * If no attribute exists, return the option value.
     *
     * @param {jQuery} element
     * @param {String} key
     * @returns {*}
     */
    readOption: function(element, key) {
        var value = element.data((this.keyName + '-' + key).toLowerCase());

        if ($.type(value) === 'undefined') {
            value = this.options[key];
        }

        return value;
    },

    /**
     * Attempt to read a value from an element using the query.
     * Query can either be an attribute name, or a callback function.
     *
     * @param {jQuery} element
     * @param {String|Function} query
     * @returns {String}
     */
    readValue: function(element, query) {
        if (!query) {
            return null;
        }

        element = $(element);

        if ($.type(query) === 'function') {
            return query.call(this, element);
        }

        return element.attr(query);
    },

    /**
     * Render a template and return a jQuery element.
     *
     * @param {String|Function} template
     * @returns {jQuery}
     */
    render: function(template) {
        return $(Toolkit.buildTemplate(template));
    },

    /**
     * Request data from a URL and handle all the possible scenarios.
     *
     * @param {Object} options
     * @param {Object} [params]
     * @returns {jQuery.ajax}
     */
    requestData: function(options, params) {
        var ajax = {};

        // Determine base options
        if ($.type(this.options.ajax) === 'object') {
            ajax = this.options.ajax;
        }

        // Set default options
        if ($.type(options) === 'string') {
            ajax.url = options;

        } else {
            $.extend(ajax, options);
        }

        // Prepare XHR object
        ajax.context = this;
        ajax.beforeSend = function(xhr) {
            xhr.url = ajax.url;
            xhr.cache = ((!ajax.type || ajax.type.toUpperCase() === 'GET') && this.options.cache);
            xhr.settings = ajax;
            xhr.params = params || {};

            this.onRequestBefore.call(this, xhr);
        };

        return $.ajax(ajax)
            .done(this.onRequestDone)
            .fail(this.onRequestFail);
    },

    /**
     * Set the component element and extract the optional namespace.
     *
     * @param {*} element
     * @returns {jQuery}
     */
    setElement: function(element) {
        this.element = element = $(element);

        // Find a namespace
        this.namespace = element.data(this.keyName) || '';

        return element;
    },

    /**
     * After merging options with the default options,
     * inherit options from an elements data attributes.
     *
     * @param {Object} [options]
     * @param {jQuery} [inheritFrom]
     * @returns {Object}
     */
    setOptions: function(options, inheritFrom) {

        // Inherit options from a group if the data attribute exists
        // Do this first so responsive options can be triggered afterwards
        if (inheritFrom) {
            var group = this.readOption(inheritFrom, 'group');

            if (group && options.groups[group]) {
                $.extend(options, options.groups[group]);
            }
        }

        var opts = Base.prototype.setOptions.call(this, options);

        // Inherit options from element data attributes
        if (inheritFrom) {
            opts = this.inheritOptions(opts, inheritFrom);
        }

        // Convert hover to mouseenter
        if (opts.mode && opts.mode === 'hover') {
            opts.mode = Toolkit.isTouch ? 'click' : 'mouseenter';
        }

        this.options = opts;

        return opts;
    },

    /**
     * Show the element and optionally set the activating node.
     *
     * @param {jQuery} [node]
     */
    show: function(node) {
        if (node) {
            this.node = $(node);
        }

        this.fireEvent('showing');

        this.element.reveal();

        this.fireEvent('shown');
    },

    /**
     * {@inheritdoc}
     */
    doDestroy: function() {
        if (this.element) {
            this.element.removeData('toolkit.' + this.keyName);
        }
    },

    /**
     * Event handler for events that should hide the element if it is visible.
     */
    onHide: function() {
        if (this.element.is(':shown')) {
            this.hide();
        }
    },

    /**
     * Event handler for AJAX `before` events when called through `requestData()`.
     *
     * @param {jQuery.ajax} xhr
     */
    onRequestBefore: function(xhr) {
        this.cache[xhr.url] = true; // True means that we are fetching the data

        // Set loading state
        this.element
            .addClass('is-loading')
            .aria('busy', true);
    },

    /**
     * Event handler for AJAX `done` events when called through `requestData()`.
     *
     * @param {String} response
     * @param {String} status
     * @param {jQuery.ajax} xhr
     */
    onRequestDone: function(response, status, xhr) {
        var url = xhr.url;

        // Remove loading state
        this.element
            .removeClass('is-loading')
            .aria('busy', false);

        // Clear cache
        delete this.cache[url];

        // HTML
        if (xhr.getResponseHeader('Content-Type').indexOf('text/html') >= 0) {
            if (xhr.cache) {
                this.cache[url] = response;
            }

            this.position(response);

        // JSON, others
        } else {
            this.process(response);
        }
    },

    /**
     * Event handler for AJAX `fail` events when called through `requestData()`.
     *
     * @param {jQuery.ajax} xhr
     * @param {String} status
     * @param {String} error
     */
    onRequestFail: function(xhr, status, error) {
        delete this.cache[xhr.url];

        // Remove loading state
        this.element
            .removeClass('is-loading')
            .addClass('has-failed')
            .aria('busy', false);

        this.position(Toolkit.messages.error);
    },

    /**
     * Event handler for `show` clicks or hovers.
     *
     * @param {jQuery.Event} e
     * @private
     */
    onShow: function(e) {
        e.preventDefault();

        this.show(e.currentTarget);
    }

}, {
    ajax: {},
    context: null,
    className: ''
});

/**
 * Bound a number between a min and max range.
 * If the number is greater than or equal to the max, reset to min (or 0).
 * If the number is less than the min, reset to the max - 1.
 *
 * @param {Number} value
 * @param {Number} max
 * @param {Number} [min]
 * @returns {Number}
 */
$.bound = function(value, max, min) {
    min = min || 0;

    if (value >= max) {
        value = min;
    } else if (value < min) {
        value = max - 1;
    }

    return value;
};

/**
 * Used for CSS animations and transitions.
 *
 * @param {jQuery} obj
 * @returns {bool}
 */
$.expr[':'].shown = function(obj) {
    return ($(obj).css('visibility') !== 'hidden');
};

/**
 * An event that triggers when a horizontal browser window resize occurs.
 *
 * @returns {Object}
 */
$.event.special.horizontalresize = (function() {
    var win = $(window),
        lastWidth = win.width();

    function handleResize(e) {
        var currentWidth = win.width();

        if (currentWidth !== lastWidth) {
            lastWidth = currentWidth;

            $(e.target).trigger('horizontalresize');
        }
    }

    return {
        setup: function() {
            win.on('resize', handleResize);
        },
        teardown: function() {
            win.off('resize', handleResize);
        }
    };
})();

var Accordion = Toolkit.Accordion = Component.extend({
    name: 'Accordion',
    version: '2.0.0',

    /** Collection of header elements. */
    headers: [],

    /* Last opened section index. */
    index: 0,

    /** Collection of section elements. */
    sections: [],

    /**
     * Initialize the accordion.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        var self = this;

        element = this.setElement(element).attr('role', 'tablist');
        options = this.setOptions(options, element);

        // Find headers and cache the index of each header and set ARIA attributes
        this.headers = element.find(this.ns('header')).each(function(index) {
            $(this)
                .data('accordion-index', index)
                .attr({
                    role: 'tab',
                    id: self.id('header', index)
                })
                .aria({
                    controls: self.id('section', index),
                    selected: false,
                    expanded: false
                });
        });

        // Find sections and cache the height so we can use for sliding and set ARIA attributes
        this.sections = element.find(this.ns('section')).each(function(index) {
            $(this)
                .attr({
                    role: 'tabpanel',
                    id: self.id('section', index)
                })
                .aria('labelledby', self.id('header', index))
                .conceal();
        });

        // Set events
        this.addEvents([
            ['horizontalresize', 'window', $.debounce(this.calculate.bind(this))],
            ['{mode}', 'element', 'onShow', this.ns('header')]
        ]);

        // Initialize
        this.initialize();

        // Jump to the index on page load
        this.calculate();
        this.jump(options.defaultIndex);
    },

    /**
     * Reveal all sections before destroying.
     */
    destructor: function() {
        this.headers.addClass('is-active').attr('toggled', true);
        this.sections.attr('style', '').reveal();
    },

    /**
     * Loop through each section and calculate/cache it's current height.
     * An optional callback can be defined that will be used for height calculation.
     *
     * @param {Function} [callback]
     */
    calculate: function(callback) {
        if ($.type(callback) !== 'function') {
            callback = function(section) {
                return section.outerHeight();
            };
        }

        this.sections.each(function() {
            var self = $(this),
                className = self.hasClass('hide') ? 'hide' : 'show',
                maxHeight = self.css('max-height');

            // Make section visible
            self.addClass('no-transition').removeClass(className).css('max-height', '');

            // Get the height
            var height = callback.call(this, self);

            // Set section back to previous state
            self.addClass(className).css('max-height', maxHeight).removeClass('no-transition');

            // Set the height
            self.data('accordion-height', height);

            if (self.hasClass('show')) {
                self.css('max-height', height);
            }
        });
    },

    /**
     * Go to the section indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     */
    jump: function(index) {
        this.show(this.headers[$.bound(index, this.headers.length)]);
    },

    /**
     * Toggle the section display of a row via the header click/hover event.
     * Take into account the multiple and collapsible options.
     *
     * @param {jQuery} header
     */
    show: function(header) {
        header = $(header);

        var options = this.options,
            section = header.next(), // section
            index = header.data('accordion-index'),
            height = parseInt(section.data('accordion-height'), 10),
            isNode = (this.node && this.node.is(header));

        this.fireEvent('showing', [section, header, this.index]);

        // Allow simultaneous open and closed sections
        // Or allow the same section to collapse
        if (options.mode === 'click' && (options.multiple || options.collapsible && isNode)) {
            if (section.is(':shown') && this.node) {
                section.css('max-height', 0).conceal(true);
                header.aria('toggled', false).removeClass('is-active');

            } else {
                section.css('max-height', height).reveal(true);
                header.aria('toggled', true).addClass('is-active');
            }

        // Only one open at a time
        } else {

            // Exit early so we don't mess with animations
            if (isNode) {
                return;
            }

            this.sections.css('max-height', 0).conceal(true);
            section.css('max-height', height).reveal(true);

            this.headers.aria('toggled', false).removeClass('is-active');
            header.aria('toggled', true).addClass('is-active');
        }

        this.index = index;
        this.node = header;

        this.fireEvent('shown', [section, header, index]);
    }

}, {
    mode: 'click',
    defaultIndex: 0,
    multiple: false,
    collapsible: false
});

Toolkit.createPlugin('accordion', function(options) {
    return new Accordion(this, options);
});

var TemplateComponent = Toolkit.TemplateComponent = Component.extend({

    /**
     * Create an element from the `template` or `templateFrom` options.
     *
     * @param {Object} [options]
     * @returns {jQuery}
     */
    createElement: function(options) {
        options = options || this.options;

        // Create template
        var template = $(options.templateFrom);

        if (!template.length) {
            template = this.render(options.template);
        }

        if (!template.length) {
            throw new Error('Failed to render template');
        }

        // Add a class name
        if (options.className) {
            template.addClass(options.className);
        }

        // Add animation class
        if (options.animation) {
            template.addClass(options.animation);
        }

        return template
            .attr('id', this.id())
            .conceal(true) // Add hide class
            .hide() // Set display to none
            .appendTo('body');
    },

    /**
     * {@inheritdoc}
     */
    doDestroy: function() {
        Component.prototype.doDestroy.call(this);

        this.element.remove();
    }

}, {
    template: '',
    templateFrom: ''
});

/** Has the blackout been created already? */
var blackoutInstance = null;

var Blackout = Toolkit.Blackout = TemplateComponent.extend({
    name: 'Blackout',
    version: '2.0.0',

    /** How many times the blackout has been opened while being opened. */
    count: 0,

    /** The loader animation element. */
    loader: null,

    /** The message element. */
    message: null,

    /**
     * Create the blackout and loader elements.
     *
     * @param {Object} [options]
     */
    constructor: function(options) {
        options = this.setOptions(options);
        this.element = this.createElement();

        // Generate loader elements
        this.loader = this.render(options.loaderTemplate).appendTo(this.element);
        this.message = this.loader.find(this.ns('message', 'loader'));

        if (options.showLoading) {
            this.message.html(Toolkit.messages.loading);
        }

        // Initialize
        this.initialize();
    },

    /**
     * Remove the blackout element and reset instance.
     */
    destructor: function() {
        this.element.remove();
        blackoutInstance = null;
    },

    /**
     * Hide the blackout if count reaches 0.
     */
    hide: function() {
        this.fireEvent('hiding');

        var count = this.count - 1;

        if (count <= 0) {
            this.count = 0;
            this.element.conceal();
        } else {
            this.count = count;
        }

        this.hideLoader();

        this.fireEvent('hidden', [(count <= 0)]);
    },

    /**
     * Hide the loader.
     */
    hideLoader: function() {
        // There's an issue on Chrome where calling conceal() here doesn't work
        // when the blackout is being transitioned. So just change it's display.
        this.loader.hide();
    },

    /**
     * Show the blackout and increase open count.
     */
    show: function() {
        this.fireEvent('showing');

        var show = false;

        this.count++;

        if (this.count === 1) {
            this.element.reveal();
            show = true;
        }

        this.showLoader();

        this.fireEvent('shown', [show]);
    },

    /**
     * Show the loader.
     */
    showLoader: function() {
        // The same problem for hide() applies here, so just change the display.
        this.loader.show();
    }

}, {
    showLoading: true,
    template: function(bem) {
        return '<div class="' + bem('blackout') + '"></div>';
    },
    templateFrom: '#toolkit-blackout-1',
    loaderTemplate: function(bem) {
        return '<div class="' + bem('loader') + ' bar-wave">' +
            '<span></span><span></span><span></span><span></span><span></span>' +
            '<div class="' + bem('loader', 'message') + '" data-loader-message></div>' +
        '</div>';
    }
});

/**
 * Only one instance of Blackout should exist,
 * so provide a factory method that stores the instance.
 *
 * @param {Object} [options]
 * @returns {Toolkit.Blackout}
 */
Blackout.instance = function(options) {
    if (blackoutInstance) {
        return blackoutInstance;
    }

    return blackoutInstance = new Blackout(options);
};

/**
 * An event that triggers when a swipe event occurs over a target element.
 * Uses touch events for touch devices, and mouse events for non-touch devices.
 *
 * Implementation is a heavily modified version of the swipe events found in jQuery Mobile.
 * Credits to the jQuery team for the original implementation.
 *
 * @returns {Object}
 */
$.event.special.swipe = (function() {
    var startEvent = isTouch ? 'touchstart' : 'mousedown',
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

var Carousel = Toolkit.Carousel = Component.extend({
    name: 'Carousel',
    version: '2.1.7',

    /** Is the carousel currently animating? */
    animating: false,

    /** The parent list that contains the items. */
    container: null,

    /** Currently displayed item by index. */
    index: -1,

    /** Collection of items to display in the carousel. */
    items: [],

    /** Is the carousel stopped or paused? */
    stopped: false,

    /** Collection of tabs to use for jumping to items. */
    tabs: [],

    /** Cycle timer. */
    timer: null,

    /** The dimension (width or height) to read sizes from. */
    _dimension: '',

    /** The position (left, right, or top) to modify for cycling. */
    _position: '',

    /** The size (width/height, margin) of each item. */
    _sizes: [],

    /** The index to reset to while infinite scrolling. */
    _resetTo: null,

    /**
     * Initialize the carousel.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        var items, self = this;

        element = this.setElement(element);
        options = this.setOptions(options, element);

        // Set animation and ARIA
        element
            .aria('live', options.autoCycle ? 'assertive' : 'off')
            .addClass(options.animation);

        // Find the item container and disable transitions for initial load
        this.container = element.find(this.ns('items'))
            .addClass('no-transition');

        // Find all the items and set ARIA attributes
        this.items = items = this.container.find('> li').each(function(index) {
            $(this)
                .attr({
                    role: 'tabpanel',
                    id: self.id('item', index)
                })
                .data('carousel-index', index)
                .aria('hidden', (index > 0));
        });

        // Find all tabs and set ARIA attributes
        this.tabs = element.find(this.ns('tabs'))
            .attr('role', 'tablist')
            .find('a').each(function(index) {
                $(this)
                    .data('carousel-index', index)
                    .attr({
                        role: 'tab',
                        id: self.id('tab', index)
                    })
                    .aria({
                        controls: self.id('item', index),
                        selected: false,
                        expanded: false
                    });
            });

        // Set events
        this.addEvents([
            ['resize', 'window', $.throttle(this.calculate.bind(this), 50)],
            ['keydown', 'window', 'onKeydown'],
            ['click', 'element', 'onJump', this.ns('tabs') + ' a'],
            ['click', 'element', 'next', this.ns('next')],
            ['click', 'element', 'prev', this.ns('prev')],
            ['click', 'element', 'start', this.ns('start')],
            ['click', 'element', 'stop', this.ns('stop')]
        ]);

        if (options.swipe) {
            this.addEvents([
                ['swipeleft', 'element', 'next'],
                ['swipeup', 'element', 'next'],
                ['swiperight', 'element', 'prev'],
                ['swipedown', 'element', 'prev']
            ]);
        }

        if (options.stopOnHover) {
            this.addEvents([
                ['mouseenter', 'element', 'stop'],
                ['mouseleave', 'element', 'start']
            ]);
        }

        // Initialize
        this.initialize();

        // Prepare the carousel
        this._setupState();
        this._buildClones();

        // Start the carousel
        this.calculate();
        this.start();
        this.jump(options.defaultIndex);
    },

    /**
     * Stop the carousel before destroying.
     */
    destructor: function() {
        this.stop();

        // Go to first item
        this.jump(0);

        // Remove clones
        var dir = this._position || 'left';

        this.container.transitionend(function() {
            $(this)
                .addClass('no-transition')
                .css(dir, 0)
                .find('li.is-cloned')
                    .remove();
        });
    },

    /**
     * Calculate the widths or heights for the items, the wrapper, and the cycle.
     */
    calculate: function() {
        if (this.options.animation === 'fade') {
            return;
        }

        var dimension = this._dimension, // height or width
            containerSize = 0,
            sizes = [];

        this.container.removeAttr('style');

        this.items.each(function() {
            var item = $(this).removeAttr('style'),
                size = item[dimension](),
                marginStart = parseInt(item.css('margin-' + (dimension === 'width' ? 'left' : 'top')), 10),
                marginEnd = parseInt(item.css('margin-' + (dimension === 'width' ? 'right' : 'bottom')), 10),
                totalSize = size + marginStart + marginEnd;

            containerSize += totalSize;

            sizes.push({
                size: size,
                totalSize: totalSize,
                marginStart: marginStart,
                marginEnd: marginEnd,
                clone: item.hasClass('is-cloned')
            });

            // Set the size of the item explicitly
            item.css(dimension, size);
        });

        // Store the sizes
        this._sizes = sizes;

        // Set the container width/height
        this.container.css(dimension, containerSize);
    },

    /**
     * Go to the item indicated by the index number.
     *
     * @param {Number} index
     */
    jump: function(index) {
        if (this.animating) {
            return;
        }

        var indexes = this._getIndex(index),
            cloneIndex = indexes[0], // The index including clones
            visualIndex = indexes[1]; // The index excluding clones

        // Exit early if jumping to same index
        if (visualIndex === this.index) {
            return;
        }

        this.fireEvent('jumping', [this.index]);

        // Update tabs and items state
        this._updateTabs(visualIndex);
        this._updateItems(cloneIndex);

        // Animate and move the items
        this._beforeCycle();

        if (this.options.animation === 'fade') {
            this.items
                .conceal(true)
                .eq(visualIndex)
                    .transitionend(this._afterCycle.bind(this))
                    .reveal(true);

        } else {
            this.container
                .transitionend(this._afterCycle.bind(this))
                .css(this._position, -this._getSizeSum(cloneIndex));
        }

        // Store the index
        this.index = visualIndex;

        this.reset();
        this.fireEvent('jumped', [visualIndex]);
    },

    /**
     * Go to the next item.
     */
    next: function() {
        this.jump(this.index + this.options.itemsToCycle);
    },

    /**
     * Go to the previous item.
     */
    prev: function() {
        this.jump(this.index - this.options.itemsToCycle);
    },

    /**
     * Reset the timer.
     */
    reset: function() {
        if (this.options.autoCycle) {
            clearInterval(this.timer);
            this.timer = setInterval(this.onCycle.bind(this), this.options.duration);
        }
    },

    /**
     * Start the carousel.
     */
    start: function() {
        this.element.removeClass('is-stopped');
        this.stopped = false;

        this.fireEvent('start');
    },

    /**
     * Stop the carousel.
     */
    stop: function() {
        this.element.addClass('is-stopped');
        this.stopped = true;

        clearInterval(this.timer);

        this.fireEvent('stop');
    },

    /**
     * Functionality to trigger after a cycle transition has ended.
     * Will set animating to false and re-enable jumping.
     *
     * If `resetTo` is set, then reset the internal DOM index for infinite scrolling.
     * Also clean-up the `no-transition` class from the container.
     *
     * @private
     */
    _afterCycle: function() {
        this.animating = false;

        var container = this.container,
            resetTo = this._resetTo;

        // Reset the currently shown item to a specific index
        // This achieves the circular infinite scrolling effect
        if (resetTo !== null) {
            container
                .addClass('no-transition')
                .css(this._position, -this._getSizeSum(resetTo));

            this._updateItems(resetTo);
            this._resetTo = null;
        }

        // Set in a timeout or transition will still occur
        setTimeout(function() {
            container.removeClass('no-transition');
            this.fireEvent('cycled');
        }.bind(this), 15); // IE needs a minimum of 15
    },

    /**
     * Functionality to trigger before a cycle transition begins.
     * Will set the animating flag to true so that jumping is disabled.
     *
     * @private
     */
    _beforeCycle: function() {
        this.animating = true;
        this.fireEvent('cycling');
    },

    /**
     * Create clones to support infinite scrolling.
     * The beginning set of cloned items should be appended to the end,
     * while the end set of cloned items should be prepended to the beginning.
     *
     * @private
     */
    _buildClones: function() {
        var options = this.options,
            items = this.items,
            container = this.container,
            itemsToShow = options.itemsToShow;

        if (!options.infinite) {
            return;
        }

        // Append the first items
        items.slice(0, itemsToShow)
            .clone()
            .addClass('is-cloned')
            .removeAttr('id')
            .removeAttr('role')
            .appendTo(container);

        // Prepend the last items
        items.slice(-itemsToShow)
            .clone()
            .addClass('is-cloned')
            .removeAttr('id')
            .removeAttr('role')
            .prependTo(container);

        // Refresh items list
        this.items = container.find('> li');
    },

    /**
     * Determine the index to jump to while taking cloned elements and infinite scrolling into account.
     * Will return an array for the DOM element index (including clones) and the visual indication index
     * for active states.
     *
     * @param {Number} index    The visual index (not the clone index)
     * @returns {Array}
     * @private
     */
    _getIndex: function(index) {
        var options = this.options,
            itemsToShow = options.itemsToShow,
            visualIndex,
            cloneIndex;

        index = parseInt(index, 10);

        if (options.infinite) {
            var lengthWithClones = this.items.length,
                lengthWithoutClones = lengthWithClones - (itemsToShow * 2);

            // If the cycle reaches the clone past the end
            if (index >= lengthWithoutClones) {
                this._resetTo = 0 + itemsToShow;

                // Set the literal index to the clone on the end
                cloneIndex = lengthWithClones - itemsToShow;

                // Reset the visual index to 0
                visualIndex = 0;

            // If cycle reaches the clone past the beginning
            } else if (index <= -itemsToShow) {
                this._resetTo = lengthWithoutClones;

                // Set the literal index to the clone on the beginning
                cloneIndex = 0;

                // Reset the visual index to the last
                visualIndex = lengthWithoutClones - itemsToShow;

            // If cycle is within the normal range
            } else {
                this._resetTo = null;

                // We need to alter the actual index to account for the clones
                visualIndex = index;
                cloneIndex = index + itemsToShow;
            }

        } else {
            var element = this.element.removeClass('no-next no-prev'),
                maxIndex = this.items.length - itemsToShow;

            // If cycle reaches the last visible item, remove the next button or rewind
            if (index >= maxIndex) {
                index = maxIndex;

                if (options.loop) {
                    if (index === this.index && this.index === maxIndex) {
                        index = 0;
                    }
                } else {
                    element.addClass('no-next');
                }

            // If cycle reaches the first visible item, remove prev button or fast forward
            } else if (index <= 0) {
                index = 0;

                if (options.loop) {
                    if (index === this.index && this.index === 0) {
                        index = maxIndex;
                    }
                } else {
                    element.addClass('no-prev');
                }
            }

            cloneIndex = visualIndex = index;
        }

        return [cloneIndex, visualIndex];
    },

    /**
     * Calculate the size to cycle width based on the sum of all items up to but not including the defined index.
     *
     * @param {Number} index    - Includes the clone index
     * @returns {Number}
     * @private
     */
    _getSizeSum: function(index) {
        var sum = 0;

        $.each(this._sizes, function(i, value) {
            if (i < index) {
                sum += value.totalSize;
            }
        });

        return sum;
    },

    /**
     * Setup the carousel state to introspecting property values and resetting options.
     *
     * @private
     */
    _setupState: function() {
        var options = this.options,
            animation = options.animation;

        // Cycling more than the show amount causes unexpected issues
        if (options.itemsToCycle > options.itemsToShow) {
            options.itemsToCycle = options.itemsToShow;
        }

        // Fade animations can only display 1 at a time
        if (animation === 'fade') {
            options.itemsToShow = options.itemsToCycle = 1;
            options.infinite = false;

        // Determine the dimension and position based on animation
        } else if (animation === 'slide-up') {
            this._dimension = 'height';
            this._position = 'top';

        } else if (animation === 'slide') {
            this._dimension = 'width';
            this._position = options.rtl ? 'right' : 'left';
        }
    },

    /**
     * Update the active state for the items while taking into account cloned elements.
     *
     * @param {Number} index
     * @private
     */
    _updateItems: function(index) {
        this.items
            .removeClass('is-active')
            .aria('hidden', true)
            .slice(index, index + this.options.itemsToShow)
                .addClass('is-active')
                .aria('hidden', false);
    },

    /**
     * Update the active state for the tab indicators.
     *
     * @param {Number} start
     * @private
     */
    _updateTabs: function(start) {
        var itemsToShow = this.options.itemsToShow,
            length = this.items.length,
            stop = start + itemsToShow,
            set = $([]),
            tabs = this.tabs
                .removeClass('is-active')
                .aria('toggled', false);

        if (!tabs.length) {
            return;
        }

        if (this.options.infinite) {
            length = length - (itemsToShow * 2);
        }

        if (start >= 0) {
            set = set.add(tabs.slice(start, stop));
        } else {
            set = set.add(tabs.slice(0, stop));
            set = set.add(tabs.slice(start));
        }

        if (stop > length) {
            set = set.add(tabs.slice(0, stop - length));
        }

        set
            .addClass('is-active')
            .aria('toggled', true);
    },

    /**
     * Event handler for cycling between items.
     * Will stop cycling if carousel is stopped.
     *
     * @private
     */
    onCycle: function() {
        if (!this.stopped) {
            if (this.options.reverse) {
                this.prev();
            } else {
                this.next();
            }
        }
    },

    /**
     * Event handler for jumping between items.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onJump: function(e) {
        e.preventDefault();

        this.jump($(e.currentTarget).data('carousel-index') || 0);
    },

    /**
     * Event handle for keyboard events.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onKeydown: function(e) {
        switch (e.keyCode) {
            case 37: this.prev(); break;
            case 38: this.jump(0); break;
            case 39: this.next(); break;
            case 40: this.jump(-1); break;
            default: return;
        }

        e.preventDefault();
    }

}, {
    animation: 'slide',
    duration: 5000,
    autoCycle: true,
    stopOnHover: true,
    infinite: true,
    loop: true,
    reverse: false,
    rtl: Toolkit.isRTL,
    swipe: Toolkit.isTouch,
    itemsToShow: 1,
    itemsToCycle: 1,
    defaultIndex: 0
});

Toolkit.createPlugin('carousel', function(options) {
    return new Carousel(this, options);
});

var CompositeComponent = Toolkit.CompositeComponent = TemplateComponent.extend({

    /** Cache of elements related to the component. */
    elements: {},

    /** Collection of nodes. */
    nodes: null,

    /** The container that holds each individual dynamic element. */
    wrapper: null,

    /**
     * Create an element from the `template` or `templateFrom` options.
     *
     * @param {jQuery} node
     * @param {Object} [options]
     * @returns {jQuery}
     */
    createElement: function(node, options) {
        options = this.inheritOptions(options || this.options, node);

        // Create template
        var template = TemplateComponent.prototype.createElement.call(this, options);

        // Move to wrapper
        if (this.wrapper) {
            template.appendTo(this.wrapper);
        }

        var id = node.data('toolkit.cid');

        return template
            .attr('id', this.id(id))
            .data('toolkit.cid', id);
    },

    /**
     * Create the elements wrapper.
     *
     * @return {jQuery}
     */
    createWrapper: function() {
        var options = this.options;

        return this.wrapper = this.render(options.wrapperTemplate)
            .addClass(Toolkit.buildTemplate(options.wrapperClass))
            .attr('id', this.id('wrapper'))
            .appendTo('body');
    },

    /**
     * Hide all the cached and built elements.
     */
    hideElements: function() {
        $.each(this.elements, function(i, el) {
            $(el).conceal();
        });
    },

    /**
     * Attempt to find and return an element by a unique composite ID.
     * Each element is unique per node. If the element does not exist, create it.
     *
     * @param {jQuery} node
     * @param {Function} [callback]   - Callback to trigger once an element is created
     * @returns {jQuery}
     */
    loadElement: function(node, callback) {
        var elements = this.elements,
            el,
            id = $(node).cache('toolkit.cid', function() {
                return Math.random().toString(32).substr(2);
            });

        if (elements[id]) {
            el = elements[id];
        } else {
            el = elements[id] = this.createElement(node);

            if ($.type(callback) === 'function') {
                callback.call(this, el);
            }
        }

        return this.element = el;
    },

    /**
     * {@inheritdoc}
     */
    doDestroy: function() {
        var key = this.keyName;

        // Remove instances
        if (this.nodes) {
            this.nodes.removeData('toolkit.' + key);

            delete Toolkit.cache[key + ':' + this.nodes.selector];
        }

        // Hide elements
        this.hideElements();

        // Remove wrapper
        if (this.wrapper) {
            this.wrapper.remove();
        }
    },

    /**
     * Event handler for toggling an element through click or hover events.
     *
     * @param {jQuery.Event} e
     * @private
     */
    onShowToggle: function(e) {
        var node = $(e.currentTarget),
            element,
            isNode = (this.node && this.node.is(node)),
            cid = node.data('toolkit.cid');

        // Set the current element based on the nodes composite ID
        if (cid && this.elements[cid]) {
            element = this.elements[cid];
        } else {
            element = this.element;
        }

        if (element && element.is(':shown')) {

            // Touch devices should pass through on second click
            if (Toolkit.isTouch) {
                if (!isNode || this.node.prop('tagName').toLowerCase() !== 'a') {
                    e.preventDefault();
                }

                // Non-touch devices
            } else {
                e.preventDefault();
            }

            if (isNode) {
                // Second click should close it
                if (this.options.mode === 'click') {
                    this.hide();
                }

                // Exit if the same node so it doesn't re-open
                return;
            }

        } else {
            e.preventDefault();
        }

        this.show(node);
    }

}, {
    wrapperClass: '',
    wrapperTemplate: '<div class="toolkit-plugin"></div>'
});

/**
 * An event that allows the clicking of the document to trigger a callback.
 * However, will only trigger if the element clicked is not in the exclude list or a child of.
 * Useful for closing drop downs and menus.
 *
 * Based on and credited to http://benalman.com/news/2010/03/jquery-special-events/
 *
 * @returns {Object}
 */
$.event.special.clickout = (function() {
    var elements = [];

    $(document).on(isTouch ? 'touchend' : 'click', function(e) {
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

var Drop = Toolkit.Drop = CompositeComponent.extend({
    name: 'Drop',
    version: '2.1.0',

    /**
     * Initialize the drop.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        this.nodes = $(nodes);
        this.setOptions(options);

        // Set events
        this.addEvents([
            ['clickout', 'document', 'hide', this.ns('menu')],
            ['clickout', 'document', 'hide', '{selector}'],
            ['{mode}', 'document', 'onShow', '{selector}']
        ]);

        // Initialize
        this.initialize();
    },

    /**
     * Hide element when destroying.
     */
    destructor: function() {
        this.hide();

        // Hide all other menus as well
        $(this.ns('menu')).conceal();
    },

    /**
     * Find the menu for the current node.
     *
     * @param {jQuery} node
     */
    createElement: function(node) {
        var target = this.readValue(node, this.options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            throw new Error('Drop menu ' + target + ' does not exist');
        }

        return $(target);
    },

    /**
     * Hide the opened menu and reset the nodes active state.
     */
    hide: function() {
        var element = this.element,
            node = this.node;

        // Clickout check
        if (!element && !node) {
            return;
        }

        this.fireEvent('hiding', [element, node]);

        element.conceal();

        node
            .aria('toggled', false)
            .removeClass('is-active');

        this.fireEvent('hidden', [element, node]);
    },

    /**
     * Open the target menu and apply active state to the node.
     *
     * @param {jQuery} node
     */
    show: function(node) {
        this.node = node = $(node);

        var element = this.loadElement(node);

        this.fireEvent('showing', [element, node]);

        element.reveal();

        node
            .aria('toggled', true)
            .addClass('is-active');

        this.fireEvent('shown', [element, node]);
    },

    /**
     * When a node is clicked, grab the target from the attribute.
     * Validate the target element, then either display or hide.
     *
     * @param {jQuery.Event} e
     * @private
     */
    onShow: function(e) {
        e.preventDefault();

        // Hide previous drops
        this.hide();

        // Toggle the menu
        var node = $(e.currentTarget),
            menu = this.loadElement(node);

        if (!menu.is(':shown')) {
            this.show(node);

        } else {
            this.hide();
        }
    }

}, {
    mode: 'click',
    getTarget: 'data-drop'
});

Toolkit.createPlugin('drop', function(options) {
    return new Drop(this, options);
}, true);

var Flyout = Toolkit.Flyout = CompositeComponent.extend({
    name: 'Flyout',
    version: '2.1.3',

    /** Current URL to generate a flyout menu for. */
    url: '',

    /** Raw JSON data. */
    data: [],

    /** Data indexed by URL. */
    dataMap: {},

    /** Show and hide timers. */
    timers: {},

    /**
     * Initialize the flyout. A URL is required during construction.
     *
     * @param {jQuery} nodes
     * @param {String} url
     * @param {Object} [options]
     */
    constructor: function(nodes, url, options) {
        if (Toolkit.isTouch) {
            return; // Flyouts shouldn't be usable on touch devices
        }

        this.nodes = $(nodes);
        options = this.setOptions(options);
        this.createWrapper();

        if (options.mode === 'click') {
            this.addEvents([
                ['click', 'document', 'onShowToggle', '{selector}'],
                ['resize', 'window', $.debounce(this.onHide.bind(this))]
            ]);
        } else {
            this.addEvents([
                ['mouseenter', 'document', 'onShowToggle', '{selector}'],
                ['mouseenter', 'document', 'onEnter', '{selector}'],
                ['mouseleave', 'document', 'onLeave', '{selector}']
            ]);
        }

        this.initialize();

        // Load data from the URL
        if (url) {
            $.getJSON(url, function(response) {
                this.load(response);
            }.bind(this));
        }
    },

    /**
     * Remove timers before destroying.
     */
    destructor: function() {
        this.clearTimer('show');
        this.clearTimer('hide');
    },

    /**
     * Clear a timer by key.
     *
     * @param {String} key
     */
    clearTimer: function(key) {
        clearTimeout(this.timers[key]);
        delete this.timers[key];
    },

    /**
     * Hide the currently shown menu.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.element.conceal();

        this.node.removeClass('is-active');

        this.fireEvent('hidden');
    },

    /**
     * Load the data into the class and save a mapping of it.
     *
     * @param {Object} data
     * @param {Number} [depth]
     */
    load: function(data, depth) {
        depth = depth || 0;

        // If root, store the data
        if (!depth) {
            this.data = data;
        }

        // Store the data indexed by URL
        if (data.url) {
            this.dataMap[data.url] = data;
        }

        if (data.children) {
            for (var i = 0, l = data.children.length; i < l; i++) {
                this.load(data.children[i], depth + 1);
            }
        }
    },

    /**
     * Position the menu below the target node.
     */
    position: function() {
        var options = this.options,
            node = this.node,
            element = this.loadElement(node);

        // Only position if the menu has children
        if (!element.children().length) {
            return;
        }

        this.fireEvent('showing');

        var height = element.outerHeight(),
            coords = node.offset(),
            x = coords.left + options.xOffset,
            y = coords.top + options.yOffset + node.outerHeight(),
            windowScroll = $(window).height(),
            dir = 'left';

        // If menu goes below half page, position it above
        if (y > (windowScroll / 2)) {
            y = coords.top - options.yOffset - height;
        }

        // Change position for RTL
        if (Toolkit.isRTL) {
            x = $(window).width() - coords.left - node.outerWidth();
            dir = 'right';
        }

        element
            .css('top', y)
            .css(dir, x)
            .reveal();

        this.fireEvent('shown');
    },

    /**
     * Show the menu below the node.
     *
     * @param {jQuery} node
     */
    show: function(node) {
        node = $(node);

        var target = this.readValue(node, this.options.getUrl) || node.attr('href');

        // When jumping from one node to another
        // Immediately hide the other menu and start the timer for the current one
        if (this.url && target !== this.url) {
            this.hide();
            this.startTimer('show', this.options.showDelay);
        }

        // Set the state
        this.url = target;
        this.node = node.addClass('is-active');

        // Load the menu
        this.loadElement(node, function(flyout) {
            flyout.addClass('is-root');

            if (this.dataMap[target]) {
                this._buildMenu(flyout, this.dataMap[target]);
            }
        });

        // Display immediately if click
        if (this.options.mode === 'click') {
            this.position();
        }
    },

    /**
     * Add a timer that should trigger a function after a delay.
     *
     * @param {String} key
     * @param {Number} delay
     * @param {Array} [args]
     */
    startTimer: function(key, delay, args) {
        this.clearTimer(key);

        var func;

        if (key === 'show') {
            func = this.position;
        } else {
            func = this.hide;
        }

        if (func) {
            this.timers[key] = setTimeout(function() {
                func.apply(this, args || []);
            }.bind(this), delay);
        }
    },

    /**
     * Build a nested list menu using the data object.
     *
     * @private
     * @param {jQuery} menu
     * @param {Object} data
     */
    _buildMenu: function(menu, data) {
        if (!data.children || !data.children.length) {
            return;
        }

        var options = this.options,
            groups = [],
            ul,
            li,
            tag,
            limit = options.itemLimit,
            i, l;

        if (options.className) {
            menu.addClass(options.className);
        }

        menu
            .aria('expanded', false)
            .attr('role', 'menu');

        if (limit && data.children.length > limit) {
            i = 0;
            l = data.children.length;

            while (i < l) {
                groups.push(data.children.slice(i, i += limit));
            }
        } else {
            groups.push(data.children);
        }

        for (var g = 0, group, child; group = groups[g]; g++) {
            ul = $('<ul/>');

            for (i = 0, l = group.length; i < l; i++) {
                child = group[i];

                // Build tag
                if (child.url) {
                    li = $('<li/>');
                    tag = $('<a/>', {
                        text: child.title,
                        href: child.url,
                        role: 'menuitem'
                    });

                    // Add icon
                    $('<span/>')
                        .addClass(child.icon || (Toolkit.isRTL ? 'caret-left' : 'caret-right'))
                        .prependTo(tag);

                } else {
                    li = this.render(options.template);
                    tag = $('<span/>', {
                        text: child.title,
                        role: 'presentation'
                    });
                }

                if (child.attributes) {
                    tag.attr(child.attributes);
                }

                // Build list
                if (child.className) {
                    li.addClass(child.className);
                }

                li.append(tag).appendTo(ul);

                if (child.children && child.children.length) {
                    var childMenu = this.render(options.template)
                        .conceal()
                        .appendTo(li);

                    this._buildMenu(childMenu, child);

                    li.addClass('has-children')
                        .aria('haspopup', true)
                        .on('mouseenter', this.onPositionChild.bind(this, li))
                        .on('mouseleave', this.onHideChild.bind(this, li));
                }
            }

            menu.append(ul);
        }

        // Only monitor top level menu
        if (options.mode !== 'click' && menu.hasClass('is-root')) {
            menu.on({
                mouseenter: function() {
                    this.clearTimer('hide');
                }.bind(this),
                mouseleave: function() {
                    this.startTimer('hide', options.hideDelay);
                }.bind(this)
            });
        }
    },

    /**
     * Event handle when a mouse enters a node. Will show the menu after the timer.
     *
     * @private
     */
    onEnter: function() {
        this.clearTimer('hide');
        this.startTimer('show', this.options.showDelay);
    },

    /**
     * Event handler to hide the child menu after exiting parent li.
     *
     * @private
     * @param {jQuery} parent
     */
    onHideChild: function(parent) {
        parent = $(parent);
        parent.removeClass('is-open');
        parent.children(this.ns('menu'))
            .removeAttr('style')
            .aria({
                expanded: false,
                hidden: false
            })
            .conceal();

        this.fireEvent('hideChild', [parent]);
    },

    /**
     * Event handle when a mouse leaves a node. Will hide the menu after the timer.
     *
     * @private
     */
    onLeave: function() {
        this.clearTimer('show');
        this.startTimer('hide', this.options.showDelay);
    },

    /**
     * Event handler to position the child menu dependent on the position in the page.
     *
     * @private
     * @param {jQuery} parent
     */
    onPositionChild: function(parent) {
        var menu = parent.children(this.ns('menu'));

        if (!menu) {
            return;
        }

        menu.aria({
            expanded: true,
            hidden: true
        });

        // Alter width because of columns
        var children = menu.children();

        menu.css('width', (children.outerWidth() * children.length) + 'px');

        // Get sizes after menu positioning
        var win = $(window),
            winHeight = win.height() + win.scrollTop(),
            parentOffset = parent.offset(),
            parentHeight = parent.outerHeight(),
            oppositeClass = 'push-opposite';

        // Display menu horizontally on opposite side if it spills out of viewport
        if (Toolkit.isRTL) {
            if ((parentOffset.left - menu.outerWidth()) < 0) {
                menu.addClass(oppositeClass);
            } else {
                menu.removeClass(oppositeClass);
            }
        } else {
            if ((parentOffset.left + parent.outerWidth() + menu.outerWidth()) >= win.width()) {
                menu.addClass(oppositeClass);
            } else {
                menu.removeClass(oppositeClass);
            }
        }

        // Reverse menu vertically if below half way fold
        if (parentOffset.top > (winHeight / 2)) {
            menu.css('top', '-' + (menu.outerHeight() - parentHeight) + 'px');
        } else {
            menu.css('top', 0);
        }

        parent.addClass('is-open');
        menu.reveal();

        this.fireEvent('showChild', [parent]);
    }

}, {
    mode: 'hover',
    getUrl: 'href',
    xOffset: 0,
    yOffset: 0,
    showDelay: 350,
    hideDelay: 1000,
    itemLimit: 15,
    wrapperClass: function(bem) {
        return bem('flyouts');
    },
    template: function(bem) {
        return '<div class="' + bem('flyout') + '" data-flyout-menu></div>';
    },
    headingTemplate: function(bem) {
        return '<li class="' + bem('flyout', 'heading') + '"></li>';
    }
});

Toolkit.createPlugin('flyout', function(url, options) {
    return new Flyout(this, url, options);
}, true);

var Input = Toolkit.Input = Component.extend({
    name: 'Input',
    version: '2.1.0',

    /** The custom input element. */
    input: null,

    /** The element that wraps the custom input. */
    wrapper: null,

    /**
     * Initialize the input.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        element = this.setElement(element);
        options = this.setOptions(options, element);

        if (options.checkbox) {
            element.find(options.checkbox).inputCheckbox(options);
        }

        if (options.radio) {
            element.find(options.radio).inputRadio(options);
        }

        if (options.select) {
            element.find(options.select).inputSelect(options);
        }

        this.initialize();
    },

    /**
     * Remove the wrapper before destroying.
     */
    destructor: function() {
        var options = this.options,
            element = this.element;

        if (this.name === 'Input') {
            if (options.checkbox) {
                element.find(options.checkbox).each(function() {
                    $(this).toolkit('inputCheckbox', 'destroy');
                });
            }

            if (options.radio) {
                element.find(options.radio).each(function() {
                    $(this).toolkit('inputRadio', 'destroy');
                });
            }

            if (options.select) {
                element.find(options.select).each(function() {
                    $(this).toolkit('inputSelect', 'destroy');
                });
            }

        // Check for the wrapper as some inputs may be initialized but not used.
        // Multi-selects using native controls for example.
        } else if (this.wrapper) {
            this.wrapper.replaceWith(element);
            element.removeAttr('style');
        }
    },

    /**
     * Copy classes from one element to another, but do not copy `filterClasses` classes.
     *
     * @param {jQuery} from
     * @param {jQuery} to
     */
    copyClasses: function(from, to) {
        var classes = ($(from).attr('class') || '').replace(this.options.filterClasses, '').trim();

        if (classes) {
            $(to).addClass(classes);
        }
    },

    /**
     * Build the element to wrap custom inputs with.
     * Copy over the original class names.
     *
     * @returns {jQuery}
     */
    _buildWrapper: function() {
        var input = this.element,
            wrapper = this.render(this.options.template)
                .insertBefore(input)
                .append(input);

        if (this.options.copyClasses) {
            this.copyClasses(input, wrapper);
        }

        return wrapper;
    }

}, {
    copyClasses: true,
    filterClasses: /\binput\b/,
    checkbox: 'input:checkbox',
    radio: 'input:radio',
    select: 'select',
    template: function(bem) {
        return '<div class="' + bem('custom-input') + '"></div>';
    }
});

Toolkit.createPlugin('input', function(options) {
    return new Input(this, options);
});

var InputCheckbox = Toolkit.InputCheckbox = Input.extend({
    name: 'InputCheckbox',
    version: '2.1.0',

    /**
     * Initialize the checkbox.
     *
     * @param {jQuery} checkbox
     * @param {Object} [options]
     */
    constructor: function(checkbox, options) {
        this.element = checkbox = $(checkbox);
        options = this.setOptions(options, checkbox);
        this.wrapper = this._buildWrapper();

        // Create custom input
        this.input = this.render(options.checkboxTemplate)
            .attr('for', checkbox.attr('id'))
            .insertAfter(checkbox);

        // Initialize events
        this.initialize();
    }

}, {
    checkboxTemplate: function(bem) {
        return '<label class="' + bem('checkbox') + '"></label>';
    }
});

Toolkit.createPlugin('inputCheckbox', function(options) {
    return new InputCheckbox(this, options);
});

var InputRadio = Toolkit.InputRadio = Input.extend({
    name: 'InputRadio',
    version: '2.1.0',

    /**
     * Initialize the radio.
     *
     * @param {jQuery} radio
     * @param {Object} [options]
     */
    constructor: function(radio, options) {
        this.element = radio = $(radio);
        options = this.setOptions(options, radio);
        this.wrapper = this._buildWrapper();

        // Create custom input
        this.input = this.render(options.radioTemplate)
            .attr('for', radio.attr('id'))
            .insertAfter(radio);

        // Initialize events
        this.initialize();
    }

}, {
    radioTemplate: function(bem) {
        return '<label class="' + bem('radio') + '"></label>';
    }
});

Toolkit.createPlugin('inputRadio', function(options) {
    return new InputRadio(this, options);
});

/**
 * Return the markup of the element in the collection as a string.
 *
 * @returns {String}
 */
$.fn.toString = function() {
    return this.prop('outerHTML');
};

var InputSelect = Toolkit.InputSelect = Input.extend({
    name: 'InputSelect',
    version: '2.1.0',

    /** The custom drop element. */
    dropdown: null,

    /** Current option index when cycling with keyboard. */
    index: 0,

    /** Is the select a multiple choice? */
    multiple: false,

    /**
     * Initialize the select.
     *
     * @param {jQuery} select
     * @param {Object} [options]
     */
    constructor: function(select, options) {
        this.element = select = $(select);
        options = this.setOptions(options, select);
        this.multiple = select.prop('multiple');

        // Multiple selects must use native controls
        if (this.multiple && options.native) {
            return;
        }

        // Wrapping element
        this.wrapper = this._buildWrapper();

        // Button element to open the drop menu
        this.input = this._buildButton();

        // Initialize events
        this.addEvent('change', 'element', 'onChange');

        if (!options.native) {
            this.addEvents([
                ['blur', 'element', 'hide'],
                ['clickout', 'dropdown', 'hide'],
                ['click', 'input', 'onToggle']
            ]);

            if (!this.multiple) {
                this.addEvent('keydown', 'window', 'onCycle');
            }

            // Build custom dropdown when not in native
            this.dropdown = this._buildDropdown();

            // Cant hide/invisible the real select or we lose focus/blur
            // So place it below .custom-input
            this.element.css('z-index', 1);
        }

        this.initialize();

        // Trigger change immediately to update the label
        this.element.change();
    },

    /**
     * Hide the dropdown and remove active states.
     */
    hide: function() {
        if (!this.dropdown.is(':shown')) {
            return; // Vastly speeds up rendering time since click/out events aren't running
        }

        this.fireEvent('hiding');

        this.input.removeClass('is-active');

        this.dropdown.conceal();

        this.fireEvent('hidden');
    },

    /**
     * Show the dropdown and apply active states.
     */
    show: function() {
        this.fireEvent('showing');

        if (this.options.hideOpened) {
            $(this.ns('options', 'select')).each(function() {
                $(this).siblings('select').toolkit('inputSelect', 'hide');
            });
        }

        this.input.addClass('is-active');

        this.dropdown.reveal();

        this.fireEvent('shown');
    },

    /**
     * Build the element to represent the select button with label and arrow.
     *
     * @returns {jQuery}
     */
    _buildButton: function() {
        var options = this.options,
            button = this.render(options.selectTemplate)
                .find(this.ns('arrow', 'select')).html(this.render(options.arrowTemplate)).end()
                .find(this.ns('label', 'select')).html(Toolkit.messages.loading).end()
                .css('min-width', this.element.width())
                .insertAfter(this.element);

        // Update the height of the native select input
        this.element.css('min-height', button.outerHeight());

        return button;
    },

    /**
     * Build the custom dropdown to hold a list of option items.
     *
     * @returns {jQuery}
     */
    _buildDropdown: function() {
        var select = this.element,
            options = this.options,
            buildOption = this._buildOption.bind(this),
            renderTemplate = this.render.bind(this),
            dropdown = renderTemplate(options.optionsTemplate).attr('role', 'listbox').aria('multiselectable', this.multiple),
            list = $('<ul/>'),
            index = 0,
            self = this;

        // Must be set for `_buildOption()`
        this.dropdown = dropdown;

        select.children().each(function() {
            var optgroup = $(this);

            if (optgroup.prop('tagName').toLowerCase() === 'optgroup') {
                if (index === 0) {
                    options.hideFirst = false;
                }

                list.append(
                    renderTemplate(options.headingTemplate).text(optgroup.attr('label'))
                );

                optgroup.children().each(function() {
                    var option = $(this);

                    if (optgroup.prop('disabled')) {
                        option.prop('disabled', true);
                    }

                    if (option.prop('selected')) {
                        self.index = index;
                    }

                    list.append( buildOption(option, index) );
                    index++;
                });
            } else {
                if (optgroup.prop('selected')) {
                    self.index = index;
                }

                list.append( buildOption(optgroup, index) );
                index++;
            }
        });

        if (options.hideSelected && !options.multiple) {
            dropdown.addClass('hide-selected');
        }

        if (options.hideFirst) {
            dropdown.addClass('hide-first');
        }

        if (this.multiple) {
            dropdown.addClass('is-multiple');
        }

        this.wrapper.append(dropdown.append(list));

        return dropdown;
    },

    /**
     * Build the list item to represent the select option.
     *
     * @param {jQuery} option
     * @param {Number} index
     * @returns {jQuery}
     */
    _buildOption: function(option, index) {
        var select = this.element,
            dropdown = this.dropdown,
            options = this.options,
            selected = option.prop('selected'),
            activeClass = 'is-active';

        // Create elements
        var li = $('<li/>'),
            content = option.text(),
            description;

        if (selected) {
            li.addClass(activeClass);
        }

        if (description = this.readValue(option, options.getDescription)) {
            content += this.render(options.descTemplate).html(description).toString();
        }

        var a = $('<a/>', {
            html: content,
            href: 'javascript:;',
            role: 'option'
        }).aria('selected', selected);

        if (this.options.copyClasses) {
            this.copyClasses(option, li);
        }

        li.append(a);

        // Attach no events for disabled options
        if (option.prop('disabled')) {
            li.addClass('is-disabled');
            a.aria('disabled', true);

            return li;
        }

        // Set events
        if (this.multiple) {
            a.click(function() {
                var self = $(this),
                    selected = false;

                if (option.prop('selected')) {
                    self.parent().removeClass(activeClass);

                } else {
                    selected = true;
                    self.parent().addClass(activeClass);
                }

                option.prop('selected', selected);
                self.aria('selected', selected);

                select.change();
            });

        } else {
            var self = this;

            a.click(function() {
                dropdown
                    .find('li').removeClass(activeClass).end()
                    .find('a').aria('selected', false);

                $(this)
                    .aria('selected', true)
                    .parent()
                    .addClass(activeClass);

                self.hide();
                self.index = index;

                select.val(option.val());
                select.change();
            });
        }

        return li;
    },

    /**
     * Loop through the options and determine the index to
     * Skip over missing options, disabled options, or hidden options.
     *
     * @private
     * @param {Number} index
     * @param {Number} step
     * @param {jQuery} options
     * @returns {Number}
     */
    _loop: function(index, step, options) {
        var hideFirst = this.options.hideFirst;

        index += step;

        while (($.type(options[index]) === 'undefined') || options[index].disabled || (index === 0 && hideFirst)) {
            index += step;

            if (index >= options.length) {
                index = 0;
            } else if (index < 0) {
                index = options.length - 1;
            }
        }

        return index;
    },

    /**
     * Event handler for select option changing.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onChange: function(e) {
        var select = $(e.target),
            options = select.find('option'),
            opts = this.options,
            selected = [],
            label = [],
            self = this;

        // Fetch label from selected option
        options.each(function() {
            if (this.selected) {
                selected.push( this );
                label.push( self.readValue(this, opts.getOptionLabel) || this.textContent );
            }
        });

        // Reformat label if needed
        if (this.multiple) {
            var title = this.readValue(select, opts.getDefaultLabel),
                format = opts.multipleFormat,
                count = label.length;

            // Use default title if nothing selected
            if (!label.length && title) {
                label = title;

                // Display a counter for label
            } else if (format === 'count') {
                label = opts.countMessage
                    .replace('{count}', count)
                    .replace('{total}', options.length);

                // Display options as a list for label
            } else if (format === 'list') {
                var limit = opts.listLimit;

                label = label.splice(0, limit).join(', ');

                if (limit < count) {
                    label += ' ...';
                }
            }
        } else {
            label = label.join(', ');
        }

        // Set the label
        select.parent()
            .find(this.ns('label', 'select'))
            .text(label);

        this.fireEvent('change', [select.val(), selected]);
    },

    /**
     * Event handler for cycling through options with up and down keys.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onCycle: function(e) {
        if (!this.dropdown.is(':shown')) {
            return;
        }

        if ($.inArray(e.keyCode, [38, 40, 13, 27]) >= 0) {
            e.preventDefault();
        } else {
            return;
        }

        var options = this.element.find('option'),
            items = this.dropdown.find('a'),
            activeClass = 'is-active',
            index = this.index;

        switch (e.keyCode) {
            case 13: // enter
            case 27: // esc
                this.hide();
                return;
            case 38: // up
                index = this._loop(index, -1, options);
                break;
            case 40: // down
                index = this._loop(index, 1, options);
                break;
        }

        options.prop('selected', false);
        options[index].selected = true;

        items.parent().removeClass(activeClass);
        items.eq(index).parent().addClass(activeClass);

        this.index = index;
        this.element.change();
    },

    /**
     * Event handler for toggling custom dropdown display.
     *
     * @private
     */
    onToggle: function() {
        if (this.element.prop('disabled')) {
            return;
        }

        if (this.dropdown.is(':shown')) {
            this.hide();
        } else {
            this.show();
        }
    }

}, {
    native: Toolkit.isTouch,
    multipleFormat: 'count', // count, list
    countMessage: '{count} of {total} selected',
    listLimit: 3,
    hideOpened: true,
    hideFirst: false,
    hideSelected: false,
    getDefaultLabel: 'title',
    getOptionLabel: 'title',
    getDescription: 'data-description',
    selectTemplate: function(bem) {
        return '<div class="' + bem('select') + '" data-select>' +
            '<div class="' + bem('select', 'arrow') + '" data-select-arrow></div>' +
            '<div class="' + bem('select', 'label') + '" data-select-label></div>' +
            '</div>';
    },
    arrowTemplate: '<span class="caret-down"></span>',
    optionsTemplate: function(bem) {
        return '<div class="' + bem('drop') + ' ' + bem('drop', '', 'down') + ' ' + bem('select', 'options') + '" data-select-options></div>';
    },
    headingTemplate: function(bem) {
        return '<li class="' + bem('drop', 'heading') + '"></li>';
    },
    descTemplate: function(bem) {
        return '<span class="' + bem('drop', 'desc') + '"></span>';
    }
});

Toolkit.createPlugin('inputSelect', function(options) {
    return new InputSelect(this, options);
});


var LazyLoad = Toolkit.LazyLoad = Component.extend({
    name: 'LazyLoad',
    version: '2.1.0',

    /** Container to monitor scroll events on. */
    container: $(window),

    /** Collection of items to load. */
    items: [],

    /** How many items have been loaded. */
    loaded: 0,

    /** Force load all timer. */
    timer: null,

    /**
     * Initialize the lazy load.
     *
     * @param {jQuery} container
     * @param {Object} [options]
     */
    constructor: function(container, options) {
        container = $(container);

        options = this.setOptions(options, container);
        this.items = container.find(this.options.lazyClass);

        if (container.css('overflow') === 'auto') {
            this.container = container;
        }

        var callback = $.throttle(this.load.bind(this), options.throttle);

        // Set events
        this.addEvents([
            ['scroll', 'container', callback],
            ['resize', 'window', callback],
            ['ready', 'document', 'onReady']
        ]);

        this.initialize();
    },

    /**
     * Load all images when destroying.
     */
    destructor: function() {
        clearTimeout(this.timer);
        this.loadAll();
    },

    /**
     * Verify that the item is within the current browser viewport.
     *
     * @param {jQuery} node
     * @returns {bool}
     */
    inViewport: function(node) {
        node = $(node);

        var container = this.container,
            threshold = this.options.threshold,
            conHeight = container.height(),
            conWidth = container.width(),
            scrollTop = container.scrollTop(),
            scrollLeft = container.scrollLeft(),
            nodeOffset = node.offset(),
            left = nodeOffset.left,
            top = nodeOffset.top;

        // Re-adjust the offset to match the parent container
        // is() fails when checking against window
        if (container[0] !== window) {
            var conOffset = container.offset();

            left -= conOffset.left;
            top -= conOffset.top;
        }

        return (
            // Element is not hidden
            node.is(':visible') &&
            // Below the top
            (top >= (scrollTop - threshold)) &&
            // Above the bottom
            (top <= (scrollTop + conHeight + threshold)) &&
            // Right of the left
            (left >= (scrollLeft - threshold)) &&
            // Left of the right
            (left <= (scrollLeft + conWidth + threshold))
        );
    },

    /**
     * Loop over the lazy loaded items and verify they are within the viewport.
     */
    load: function() {
        if (this.loaded >= this.items.length) {
            this.shutdown();
            return;
        }

        this.fireEvent('loading');

        this.items.each(function(index, item) {
            if (item && this.inViewport(item)) {
                this.show(item, index);
            }
        }.bind(this));

        this.fireEvent('loaded');
    },

    /**
     * Load the remaining hidden items and remove any container events.
     */
    loadAll: function() {
        if (this.loaded >= this.items.length) {
            return;
        }

        this.fireEvent('loadAll');

        this.items.each(function(index, item) {
            this.show(item, index);
        }.bind(this));
    },

    /**
     * Show the item by removing the lazy load class.
     *
     * @param {jQuery} node
     * @param {Number} index
     */
    show: function(node, index) {
        node = $(node);

        this.fireEvent('showing', [node]);

        // Set the item being loaded for so that events can be fired
        this.element = node.removeClass(this.options.lazyClass.substr(1));

        // Replace src attributes on images
        node.find('img').each(function() {
            var image = $(this), src;

            if (Toolkit.isRetina) {
                src = image.data('src-retina');
            }

            if (!src) {
                src = image.data('src');
            }

            if (src) {
                image.attr('src', src);
            }
        });

        // Replace item with null since removing from the array causes it to break
        this.items.splice(index, 1, null);
        this.loaded++;

        this.fireEvent('shown', [node]);
    },

    /**
     * When triggered, will shutdown the instance from executing any longer.
     * Any container events will be removed and loading will cease.
     */
    shutdown: function() {
        if (this.enabled) {
            this.disable();
            this.fireEvent('shutdown');
        }
    },

    /**
     * Event handler triggered on DOM ready.
     *
     * @private
     */
    onReady: function() {
        this.load();

        // Set force load on DOM ready
        if (this.options.forceLoad) {
            this.timer = setTimeout(this.loadAll.bind(this), this.options.delay);
        }
    }

}, {
    forceLoad: false,
    delay: 10000,
    threshold: 150,
    throttle: 50,
    lazyClass: '.lazy-load'
});

Toolkit.createPlugin('lazyLoad', function(options) {
    return new LazyLoad(this, options);
});

var Mask = Toolkit.Mask = Component.extend({
    name: 'Mask',
    version: '2.0.0',

    /** Mask element used for overlaying. */
    mask: null,

    /** Message element found within the mask. */
    message: null,

    /**
     * Initialize the mask.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        element = this.setElement(element);
        options = this.setOptions(options, element);

        // Add class and set relative positioning
        if (!element.is('body')) {
            element.addClass('is-maskable');

            var position = element.css('position');

            if (!position || position === 'static') {
                element.css('position', 'relative');
            }
        }

        // Find a mask or create it
        var mask = element.find('> ' + this.ns());

        if (!mask.length) {
            mask = this.render(options.template);
        }

        this.setMask(mask);

        if (options.selector) {
            this.addEvent('click', 'document', 'toggle', options.selector);
        }

        this.initialize();
    },

    /**
     * Remove the mask element before destroying.
     */
    destructor: function() {
        this.mask.remove();
        this.element
            .removeClass('is-maskable')
            .removeClass('is-masked')
            .css('position', '');
    },

    /**
     * Hide the mask and reveal the element.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.mask.conceal();
        this.element.removeClass('is-masked');

        this.fireEvent('hidden');
    },

    /**
     * Set the element to use as a mask and append it to the target element.
     * Apply optional classes, events, and styles dependent on implementation.
     *
     * @param {jQuery} mask
     */
    setMask: function(mask) {
        var options = this.options,
            message;

        // Prepare mask
        mask.addClass('hide').appendTo(this.element);

        if (this.element.is('body')) {
            mask.css('position', 'fixed');
        }

        if (options.revealOnClick) {
            mask.click(this.hide.bind(this));
        }

        this.mask = mask;

        // Create message if it does not exist
        message = mask.find(this.ns('message'));

        if (!message.length && options.messageContent) {
            message = this.render(options.messageTemplate)
                .html(options.messageContent)
                .appendTo(mask);
        }

        this.message = message;
    },

    /**
     * Show the mask and conceal the element.
     */
    show: function() {
        this.fireEvent('showing');

        this.mask.reveal();
        this.element.addClass('is-masked');

        this.fireEvent('shown');
    },

    /**
     * Toggle between display states.
     */
    toggle: function() {
        if (this.mask.is(':shown')) {
            this.hide();
        } else {
            this.show();
        }
    }

}, {
    selector: '',
    revealOnClick: false,
    messageContent: '',
    template: function(bem) {
        return '<div class="' + bem('mask') + '" data-mask></div>';
    },
    messageTemplate: function(bem) {
        return '<div class="' + bem('mask', 'message') + '" data-mask-message></div>';
    }
});

Toolkit.createPlugin('mask', function(options) {
    return new Mask(this, options);
});

/**
 * Delays the execution of a function till the duration has completed.
 *
 * @param {Function} func
 * @param {Number} [threshold]
 * @returns {Function}
 */
$.debounce = function(func, threshold) {
    var timeout;

    return function() {
        var context = this, args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(function() {
            timeout = null;

            func.apply(context, args);
        }, threshold || 150);
    };
};

var Matrix = Toolkit.Matrix = Component.extend({
    name: 'Matrix',
    version: '2.0.0',

    /** How many columns that can fit in the wrapper. */
    colCount: 0,

    /** Height of each column. */
    colHeights: [],

    /** Calculated final width of the column (may differ from width option). */
    colWidth: 0,

    /** Collection of items within the matrix. */
    items: [],

    /** Collection of img elements. */
    images: [],

    /** List of items in order and how many columns they span horizontally. */
    matrix: [],

    /** Width of the wrapper. Is recalculated every page resize to determine column count. */
    wrapperWidth: 0,

    /**
     * Initialize the matrix.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        this.setElement(element);
        this.setOptions(options, this.element);

        // Set events
        this.addEvent('horizontalresize', 'window', $.debounce(this.onResize.bind(this)));

        this.initialize();

        // Render the matrix
        this.refresh();
    },

    /**
     * Remove inline styles before destroying.
     */
    destructor: function() {
        this.element.removeAttr('style');
        this.items.removeAttr('style');
    },

    /**
     * Append an item to the bottom of the matrix.
     *
     * @param {jQuery} item
     */
    append: function(item) {
        item = $(item)
            .addClass('hide')
            .appendTo(this.element);

        this.fireEvent('appending', [item]);

        this.refresh();
    },

    /**
     * Prepend an item to the top of the matrix.
     *
     * @param {jQuery} item
     */
    prepend: function(item) {
        item = $(item)
            .addClass('hide')
            .prependTo(this.element);

        this.fireEvent('prepending', [item]);

        this.refresh();
    },

    /**
     * Fetch new items and re-render the grid.
     */
    refresh: function() {
        this.items = this.element.find('> li').each(function() {
            var self = $(this);

            // Cache the initial column width
            self.cache('matrix-column-width', self.outerWidth());
        });

        if (this.options.defer) {
            this._deferRender();
        } else {
            this.render();
        }
    },

    /**
     * Remove an item from the grid (and DOM) and re-render.
     *
     * @param {jQuery} item
     */
    remove: function(item) {
        item = $(item);

        // Using event `remove` will cause the DOM element to delete itself
        this.fireEvent('removing', [item]);

        this.items.filter(item).remove();

        this.refresh();
    },

    /**
     * Calculate and position items in the grid.
     */
    render: function() {
        this._calculateColumns();

        this.fireEvent('rendering');

        var element = this.element,
            items = this.items;

        // No items
        if (!items.length) {
            element.removeAttr('style');

        // Single column
        } else if (this.colCount <= 1) {
            element.removeAttr('style').addClass('no-columns');
            items.removeAttr('style');

        // Multi column
        } else {
            element.removeClass('no-columns');

            this._organizeItems();
            this._positionItems();
        }

        this.fireEvent('rendered');
    },

    /**
     * Calculate how many columns can be supported in the current resolution.
     * Modify the column width to account for gaps on either side.
     *
     * @private
     */
    _calculateColumns: function() {
        var wrapperWidth = this.element.outerWidth(),
            colWidth = this.options.width,
            gutter = this.options.gutter,
            cols = Math.max(Math.floor(wrapperWidth / colWidth), 1),
            colsWidth = (cols * (colWidth + gutter)) - gutter,
            diff;

        if (cols > 1) {
            if (colsWidth > wrapperWidth) {
                diff = colsWidth - wrapperWidth;
                colWidth -= (diff / cols);

            } else if (colsWidth < wrapperWidth) {
                diff = wrapperWidth - colsWidth;
                colWidth += (diff / cols);
            }
        }

        this.wrapperWidth = wrapperWidth;
        this.colWidth = colWidth;
        this.colCount = cols;
    },

    /**
     * Fetch all images within the matrix and attach an onload event.
     * This will monitor loaded images and render once all are complete.
     * Uses a src swap trick to force load cached images.
     *
     * @private
     */
    _deferRender: function() {
        var promises = [];

        this.images = this.element.find('img').each(function(index, image) {
            if (image.complete) {
                return; // Already loaded
            }

            var src = image.src,
                def = $.Deferred();

            image.onload = def.resolve;
            image.onerror = image.onabort = def.reject;
            image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            image.src = src;

            promises.push(def.promise());
        });

        $.when.apply($, promises).always(this.render.bind(this));
    },

    /**
     * Organize the items into columns by looping over each item and calculating dimensions.
     * If an item spans multiple columns, account for it by filling with an empty space.
     *
     * @private
     */
    _organizeItems: function() {
        var item,
            span,
            size,
            l = this.items.length;

        this.matrix = [];

        for (var i = 0; i < l; i++) {
            item = this.items.eq(i);
            size = item.data('matrix-column-width');

            // How many columns does this item span?
            span = Math.max(Math.round(size / this.colWidth), 1);

            // Span cannot be larger than the total number of columns
            if (span > this.colCount) {
                span = this.colCount;
            }

            this.matrix.push({
                item: item,
                span: span
            });

            // Multiple columns
            if (span > 1) {
                for (var s = 1; s < span; s++) {
                    if (this.matrix) {
                        this.matrix.push({
                            item: item,
                            span: false // Indicates an empty space
                        });
                    }
                }
            }
        }
    },

    /**
     * Loop through the items in each column and position them absolutely.
     *
     * @private
     */
    _positionItems: function() {
        var gutter = this.options.gutter,
            items = this.matrix,
            item,
            span,
            dir = this.options.rtl ? 'right' : 'left',
            y = [], // The top position values indexed by column
            c = 0, // Current column in the loop
            h = 0, // Smallest height column
            i, // Items loop counter
            l, // Items length
            s, // Current span column in the loop
            top,
            pos = { margin: 0, position: 'absolute' };

        for (i = 0; i < this.colCount; i++) {
            y.push(0);
        }

        for (i = 0, l = items.length; i < l; i++) {
            item = items[i];
            span = item.span;

            // Place the item in the smallest column
            h = -1;

            for (s = 0; s < this.colCount; s++) {
                if (h === -1 || y[s] < h) {
                    h = y[s];
                    c = s;
                }
            }

            // If the item extends too far out, move it to the next column
            // Or if the last column has been reached
            if ((c >= this.colCount) || ((span + c) > this.colCount)) {
                c = 0;
            }

            // Item spans a column or multiple columns
            if (span) {
                top = 0;

                // If the item spans multiple columns
                // Get the largest height from the previous row
                for (s = 0; s < span; s++) {
                    if (y[c + s] > top) {
                        top = y[c + s];
                    }
                }

                // Position the item
                pos.top = top;
                pos[dir] = (this.colWidth + gutter) * c;
                pos.width = ((this.colWidth + gutter) * span) - gutter;

                item.item.css(pos).reveal();

                // Loop again to add the value to each columns Y top value
                // This must be done after positioning so we can calculate a new size
                for (s = 0; s < span; s++) {
                    y[c + s] = item.item.outerHeight() + gutter + top;
                }
            }

            this.colHeights[c] = y[c];

            c++;
        }

        // Set height of wrapper
        this.element.css('height', Math.max.apply(Math, y));
    },

    /**
     * Event handler for browser resizing.
     *
     * @private
     */
    onResize: function() {
        this.refresh();
    }

}, {
    width: 200,
    gutter: 20,
    rtl: Toolkit.isRTL,
    defer: true
});

Toolkit.createPlugin('matrix', function(options) {
    return new Matrix(this, options);
});

var Modal = Toolkit.Modal = TemplateComponent.extend({
    name: 'Modal',
    version: '2.1.0',

    /** Blackout element if enabled. */
    blackout: null,

    /**
     * Initialize the modal.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        this.nodes = $(nodes);
        options = this.setOptions(options);
        this.element = this.createElement()
            .attr('role', 'dialog')
            .aria('labelledby', this.id('title'))
            .aria('describedby', this.id('content'));

        // Enable fullscreen
        if (options.fullScreen) {
            this.element.addClass('is-fullscreen');
        }

        // Setup blackout
        if (options.blackout) {
            this.blackout = Blackout.instance();
        }

        // Initialize events
        this.addEvents([
            ['keydown', 'window', 'onKeydown'],
            ['click', 'document', 'onShow', '{selector}'],
            ['click', 'element', 'hide', this.ns('close')],
            ['click', 'element', 'onSubmit', this.ns('submit')]
        ]);

        if (options.clickout) {
            this.addEvent('click', 'element', 'onHide');
        }

        this.initialize();
    },

    /**
     * Hide the modal and reset relevant values.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.element.conceal();

        if (this.blackout) {
            this.blackout.hide();
        }

        if (this.options.stopScroll) {
            $('body').removeClass('no-scroll');
        }

        this.fireEvent('hidden');
    },

    /**
     * Position the modal in the center of the screen.
     *
     * @param {String|jQuery} content
     */
    position: function(content) {
        // AJAX is currently loading
        if (content === true) {
            return;
        }

        // Hide blackout loading message
        if (this.blackout) {
            this.blackout.hideLoader();
        }

        this.fireEvent('showing');

        var body = this.element.find(this.ns('content'));
            body.html(content);

        this.fireEvent('load', [content]);

        // Reveal modal
        this.element.reveal();

        // Resize modal
        if (this.options.fullScreen) {
            body.css('min-height', $(window).height());
        }

        this.fireEvent('shown');
    },

    /**
     * Show the modal with the specified content.
     *
     * @param {jQuery} node
     * @param {String} [content]
     */
    show: function(node, content) {
        if (node) {
            this.node = node = $(node);

            if (!content) {
                content = this.readValue(node, this.readOption(node, 'getContent')) || node.attr('href');
            }
        }

        // Show blackout if the element is hidden
        // If it is visible, the blackout count will break
        if (this.blackout && !this.element.is(':shown')) {
            this.blackout.show();
        }

        // Restrict scrolling
        if (this.options.stopScroll) {
            $('body').addClass('no-scroll');
        }

        this.loadContent(content);
    },

    /**
     * Submit the form found within the modal.
     */
    submit: function() {
        var form = this.element.find('form:first');

        if (!form) {
            return;
        }

        this.fireEvent('submit', [form]);

        var options = {
            url: form.attr('action'),
            type: (form.attr('method') || 'post').toUpperCase()
        };

        if (window.FormData) {
            options.processData = false;
            options.contentType = false;
            options.data = new FormData(form[0]);
        } else {
            options.data = form.serialize();
        }

        this.requestData(options);
    },

    /**
     * Event handler for hide().
     *
     * @private
     * @param {jQuery.Event} e
     */
    onHide: function(e) {
        var element = this.element;

        // Since the modal element covers the entire viewport, we can't trigger the `clickout` event
        // So instead we have to bind a click event to the outer modal element to hide it
        // This should not trigger if a child element is clicked
        if (e.type === 'click' && !$(e.target).is(element)) {
            return;
        }

        e.preventDefault();

        // If the modal is loading (AJAX) or is not shown, exit early
        // This stops cases where the blackout can be clicked early
        if (!element.is(':shown') || element.hasClass('is-loading')) {
            return;
        }

        this.hide();
    },

    /**
     * Event handler for closing the modal when esc is pressed.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onKeydown: function(e) {
        if (e.keyCode === 27 /*esc*/ && this.element.is(':shown')) {
            this.hide();
        }
    },

    /**
     * Submit the form within the modal if it exists and re-render the modal with the response.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onSubmit: function(e) {
        e.preventDefault();

        this.submit();
    }

}, {
    animation: 'fade',
    blackout: true,
    fullScreen: false,
    stopScroll: true,
    clickout: true,
    getContent: 'data-modal',
    template: function(bem) {
        return '<div class="' + bem('modal') + '">' +
            '<div class="' + bem('modal', 'outer') + '">' +
                '<div class="' + bem('modal', 'inner') + '" data-modal-content></div>' +
                '<button class="' + bem('modal', 'close') + '" data-modal-close><span class="x"></span></button>' +
            '</div>' +
        '</div>';
    }
});

Toolkit.createPlugin('modal', function(options) {
    return new Modal(this, options);
}, true);

var OffCanvas = Toolkit.OffCanvas = Component.extend({
    name: 'OffCanvas',
    version: '2.0.0',

    /** The parent container. */
    container: null,

    /** The primary content wrapper. */
    primary: null,

    /** Secondary sibling sidebars. */
    secondary: null,

    /** The side the primary sidebar is located. */
    side: 'left',

    /** The opposite of `side`. */
    opposite: 'right',

    /** Will be true once document ready has triggered. We must use a flag as it can be called multiple times. */
    _loaded: false,

    /**
     * Initialize off canvas.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        element = this.setElement(element).attr('role', 'complementary').conceal();
        options = this.setOptions(options, element);

        var animation = options.animation;

        // Touch devices cannot use squish
        if (Toolkit.isTouch && animation === 'squish') {
            options.animation = animation = 'push';
        }

        // Cannot have multiple non-overlayed or non-squished sidebars open
        if (animation !== 'on-top' && animation !== 'squish') {
            options.hideOthers = true;
        }

        // Setup container
        this.container = element.parent().addClass(animation);
        this.primary = element.siblings('[data-offcanvas-content]').attr('role', 'main');
        this.secondary = element.siblings('[data-offcanvas-sidebar]');

        // Determine the side
        this.side = element.data('offcanvas-sidebar') || 'left';
        this.opposite = (this.side === 'left') ? 'right' : 'left';

        // Initialize events
        this.addEvents([
            ['ready', 'document', 'onReady'],
            ['resize', 'window', 'onResize']
        ]);

        if (options.swipe) {
            if (this.side === 'left') {
                this.addEvents([
                    ['swipeleft', 'element', 'hide'],
                    ['swiperight', 'container', 'onSwipe']
                ]);
            } else {
                this.addEvents([
                    ['swipeleft', 'container', 'onSwipe'],
                    ['swiperight', 'element', 'hide']
                ]);
            }
        }

        if (options.selector) {
            this.addEvent('click', 'document', 'toggle', options.selector);
        }

        this.initialize();
    },

    /**
     * Hide sidebar when destroying.
     */
    destructor: function() {
        this.hide();
    },

    /**
     * Hide the sidebar and reset the container.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.container.removeClass('move-' + this.opposite);

        this.element
            .conceal()
            .removeClass('is-expanded')
            .aria('expanded', false);

        if (this.options.stopScroll) {
            $('body').removeClass('no-scroll');
        }

        this.fireEvent('hidden');
    },

    /**
     * Show the sidebar and squish the container to make room for the sidebar.
     * If hideOthers is true, hide other open sidebars.
     */
    show: function() {
        var options = this.options;

        if (options.hideOthers) {
            this.secondary.each(function() {
                var sidebar = $(this);

                if (sidebar.hasClass('is-expanded')) {
                    sidebar.toolkit('offCanvas', 'hide');
                }
            });
        }

        this.fireEvent('showing');

        this.container.addClass('move-' + this.opposite);

        this.element
            .reveal()
            .addClass('is-expanded')
            .aria('expanded', true);

        if (options.stopScroll) {
            $('body').addClass('no-scroll');
        }

        this.fireEvent('shown');
    },

    /**
     * Toggle between show and hide states.
     */
    toggle: function() {
        if (this.element.hasClass('is-expanded')) {
            this.hide();
        } else {
            this.show();
        }
    },

    /**
     * On page load, immediately display the sidebar.
     * Remove transitions from the sidebar and container so there is no page jumping.
     * Also disable `hideOthers` so multiple sidebars can be displayed on load.
     *
     * @private
     */
    onReady: function() {
        if (!this.options.openOnLoad || this._loaded) {
            return;
        }

        var sidebar = this.element,
            inner = this.primary,
            transClass = 'no-transition';

        sidebar.addClass(transClass);
        inner.addClass(transClass);

        this.show();

        // Transitions will still occur unless we place in a timeout
        setTimeout(function() {
            sidebar.removeClass(transClass);
            inner.removeClass(transClass);
        }, 15); // IE needs a minimum of 15

        this._loaded = true;
    },

    /**
     * Triggered when the page is resized.
     *
     * @private
     */
    onResize: function() {
        this.fireEvent('resize');
    },

    /**
     * When swiping on the container, don't trigger a show if we are trying to hide a sidebar.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onSwipe: function(e) {
        e.preventDefault();

        var target = $(e.target),
            selector = '[data-offcanvas-sidebar]';

        if (target.is(selector) || target.parents(selector).length) {
            return;
        }

        this.show();
    }

}, {
    selector: '',
    animation: 'push',
    openOnLoad: false,
    hideOthers: true,
    stopScroll: true,
    swipe: Toolkit.isTouch
});

Toolkit.createPlugin('offCanvas', function(options) {
    return new OffCanvas(this, options);
});

var Pin = Toolkit.Pin = Component.extend({
    name: 'Pin',
    version: '2.1.7',

    /** Will the element be pinned? */
    active: true,

    /** Outer height of the element. */
    elementHeight: null,

    /** The top offset value in the DOM. */
    elementTop: 0,

    /** Inner height of the parent element. */
    parentHeight: null,

    /** The top offset value of the parent in the DOM. */
    parentTop: null,

    /** Whether the element is currently pinned or not. */
    pinned: false,

    /** The element top value defined in the CSS. */
    initialTop: 0,

    /** The width and height of the viewport. Will update on resize. */
    viewport: {},

    /**
     * Initialize the pin.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        element = this.setElement(element);
        options = this.setOptions(options, element);

        // Setup classes and ARIA
        element
            .attr('role', 'complementary')
            .addClass(options.animation);

        // Determine before calculations
        var initialTop = element[0].style.top; // jQuery sometimes returns auto

        this.initialTop = (initialTop === 'auto') ? 0 : parseInt(initialTop, 10);
        this.elementTop = element.offset().top;

        // Initialize events
        var throttle = options.throttle;

        this.addEvents([
            ['scroll', 'window', $.throttle(this.onScroll.bind(this), throttle)],
            ['resize', 'window', $.throttle(this.onResize.bind(this), throttle)],
            ['ready', 'document', 'onResize']
        ]);

        this.initialize();
    },

    /**
     * Remove inline styles before destroying.
     */
    destructor: function() {
        this.active = false;

        // Need to be in a timeout or they won't be removed
        setTimeout(this.unpin.bind(this), 15);
    },

    /**
     * Calculate the dimensions and offsets of the interacting elements.
     */
    calculate: function() {
        var win = $(window),
            options = this.options,
            element = this.element,
            parent = options.context ? element.parents(options.context) : element.parent();

        this.viewport = {
            width: win.width(),
            height: win.height()
        };

        this.elementHeight = element.outerHeight(true); // Include margin
        this.parentHeight = parent.height(); // Exclude padding
        this.parentTop = parent.offset().top;

        // Disable pin if element is larger than the viewport
        if (options.lock && this.elementHeight >= this.viewport.height) {
            this.active = false;

        // Enable pin if the parent is larger than the child
        } else {
            this.active = (element.is(':visible') && this.parentHeight > this.elementHeight);
        }
    },

    /**
     * Pin the element along the vertical axis while staying contained within the parent.
     */
    pin: function() {
        var options = this.options;

        if (options.calculate) {
            this.calculate();
        }

        if (!this.active) {
            return;
        }

        var eHeight = this.elementHeight,
            eTop = this.elementTop,
            pHeight = this.parentHeight,
            pTop = this.parentTop,
            cssTop = this.initialTop,
            scrollTop = $(window).scrollTop(),
            pos = {},
            x = options.xOffset,
            y = 0;

        // Scroll is above the parent, remove pin inline styles
        if (scrollTop < pTop || scrollTop === 0) {
            if (this.pinned) {
                this.unpin();
            }

            return;
        }

        // Don't extend out the bottom
        var elementMaxPos = scrollTop + eHeight,
            parentMaxHeight = pHeight + pTop;

        // Swap positioning of the fixed menu once it reaches the parent borders
        if (options.fixed) {
            if (elementMaxPos >= parentMaxHeight) {
                y = 'auto';

                pos.position = 'absolute';
                pos.bottom = 0;

            } else if (scrollTop >= eTop) {
                y = options.yOffset;

                pos.position = 'fixed';
                pos.bottom = 'auto';
            }

        // Stop positioning absolute menu once it exits the parent
        } else {
            pos.position = 'absolute';

            if (elementMaxPos >= parentMaxHeight) {
                y += (pHeight - eHeight);

            } else {
                y += (scrollTop - pTop) + options.yOffset;
            }

            // Don't go lower than default top
            if (cssTop && y < cssTop) {
                y = cssTop;
            }
        }

        pos[options.location] = x;
        pos.top = y;

        this.element
            .css(pos)
            .addClass('is-pinned');

        this.pinned = true;

        this.fireEvent('pinned');
    },

    /**
     * Reset the element to its original state.
     */
    unpin: function() {
        this.element
            .removeAttr('style')
            .removeClass('is-pinned');

        this.pinned = false;

        this.fireEvent('unpinned');
    },

    /**
     * Determine whether to pin or unpin.
     *
     * @private
     */
    onResize: function() {
        this.calculate();
        this.pin();
        this.fireEvent('resize');
    },

    /**
     * While the viewport is being scrolled, the element should move vertically along with it.
     * The element should also stay contained within the parent element.
     *
     * @private
     */
    onScroll: function() {
        this.pin();
        this.fireEvent('scroll');
    }

}, {
    location: 'right',
    xOffset: 0,
    yOffset: 0,
    throttle: 50,
    fixed: false,
    calculate: false,
    lock: true
});

Toolkit.createPlugin('pin', function(options) {
    return new Pin(this, options);
});

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

var Tooltip = Toolkit.Tooltip = CompositeComponent.extend({
    name: 'Tooltip',
    version: '2.1.3',

    /**
     * Initialize the tooltip.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        this.nodes = $(nodes);
        options = this.setOptions(options);
        this.createWrapper();

        // Remove title attributes
        if (options.getTitle === 'title') {
            options.getTitle = 'data-' + this.keyName + '-title';

            this.nodes.each(function(i, node) {
                $(node).attr(options.getTitle, $(node).attr('title')).removeAttr('title');
            });
        }

        // Initialize events
        this.addEvents([
            ['{mode}', 'document', 'onShowToggle', '{selector}'],
            ['resize', 'window', $.debounce(this.onHide.bind(this))]
        ]);

        if (options.mode === 'click') {
            this.addEvent('clickout', 'document', 'hide');
        } else {
            this.addEvent('mouseleave', 'document', 'hide', '{selector}');
        }

        this.initialize();
    },

    /**
     * Hide the tooltip.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.hideElements();

        if (this.node) {
            this.node
                .removeAttr('aria-describedby')
                .removeClass('is-active');
        }

        this.fireEvent('hidden');
    },

    /**
     * Positions the tooltip relative to the current node or the mouse cursor.
     * Additionally will apply the title/content and hide/show if necessary.
     *
     * @param {String|jQuery} content
     * @param {String|jQuery} [title]
     */
    position: function(content, title) {
        if (content === true) {
            return; // AJAX is currently loading
        }

        this.fireEvent('showing');

        // Set the node state
        var node = this.node.aria('describedby', this.id());

        // Load runtime options
        var options = this.inheritOptions(this.options, node);

        // Load the element
        var element = this.loadElement(node);

        // Set the title and content
        title = title || this.readValue(node, options.getTitle);

        element
            .find(this.ns('header'))
                .html(title).toggle(Boolean(title) && options.showTitle)
            .end()
            .find(this.ns('content'))
                .html(content);

        this.fireEvent('load', [content, title]);

        // Follow the mouse
        if (options.follow) {
            var follow = this.onFollow.bind(this);

            node.off('mousemove', follow).on('mousemove', follow);

        // Position offset node
        } else {
            element.reveal().positionTo(options.position, node, {
                left: options.xOffset,
                top: options.yOffset
            });
        }

        this.fireEvent('shown');
    },

    /**
     * Show the tooltip and determine whether to grab the content from an AJAX call,
     * a DOM node, or plain text. The content can also be passed as an argument.
     *
     * @param {jQuery} node
     * @param {String|jQuery} [content]
     */
    show: function(node, content) {
        this.node = node = $(node).addClass('is-active');

        // Load the new element
        this.loadElement(node, function(tooltip) {
            tooltip
                .addClass(this.readOption(node, 'position'))
                .attr('role', 'tooltip');
        });

        // Load the content
        this.loadContent(content || this.readValue(node, this.readOption(node, 'getContent')));
    },

    /**
     * Event handler for positioning the tooltip by the mouse.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onFollow: function(e) {
        e.preventDefault();

        var options = this.options;

        this.element.reveal().positionTo(options.position, e, {
            left: options.xOffset,
            top: options.yOffset
        }, true);
    },

    /**
     * {@inheritdoc}
     */
    onHide: function() {
        if (!this.node) {
            return;
        }

        var element = this.loadElement(this.node);

        if (element.is(':shown')) {
            this.hide();
        }
    },

    /**
     * {@inheritdoc}
     */
    onRequestBefore: function(xhr) {
        CompositeComponent.prototype.onRequestBefore.call(this, xhr);

        if (this.options.showLoading) {
            this.position(Toolkit.messages.loading);
        }
    }

}, {
    mode: 'hover',
    animation: 'fade',
    follow: false,
    position: 'top-center',
    showLoading: true,
    showTitle: true,
    getTitle: 'title',
    getContent: 'data-tooltip',
    mouseThrottle: 50,
    xOffset: 0,
    yOffset: 0,
    wrapperClass: function(bem) {
        return bem('tooltips');
    },
    template: function(bem) {
        return '<div class="' + bem('tooltip') + '">' +
            '<div class="' + bem('tooltip', 'inner') + '">' +
                '<div class="' + bem('tooltip', 'head') + '" data-tooltip-header></div>' +
                '<div class="' + bem('tooltip', 'body') + '" data-tooltip-content></div>' +
            '</div>' +
            '<div class="' + bem('tooltip', 'arrow') + '"></div>' +
        '</div>';
    }
});

Toolkit.createPlugin('tooltip', function(options) {
    return new Tooltip(this, options);
}, true);

var Popover = Toolkit.Popover = Tooltip.extend({
    name: 'Popover',
    version: '2.1.3',

    /**
     * Initialize the popover.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        options = options || {};
        options.mode = 'click'; // Click only
        options.follow = false; // Disable mouse follow

        Tooltip.prototype.constructor.call(this, nodes, options);
    }

}, {
    getContent: 'data-popover',
    wrapperClass: function(bem) {
        return bem('popovers');
    },
    template: function(bem) {
        return '<div class="' + bem('popover') + '">' +
            '<div class="' + bem('popover', 'inner') + '">' +
                '<div class="' + bem('popover', 'head') + '" data-popover-header></div>' +
                '<div class="' + bem('popover', 'body') + '" data-popover-content></div>' +
            '</div>' +
            '<div class="' + bem('popover', 'arrow') + '"></div>' +
        '</div>';
    }
});

Toolkit.createPlugin('popover', function(options) {
    return new Popover(this, options);
}, true);

var Showcase = Toolkit.Showcase = TemplateComponent.extend({
    name: 'Showcase',
    version: '2.1.0',

    /** Is the showcase currently animating? */
    animating: false,

    /** Blackout instance if enabled. */
    blackout: null,

    /** The caption element. */
    caption: null,

    /** Items gathered when node is activated. */
    data: [],

    /** Current index of the item being shown. */
    index: -1,

    /** The wrapping items element. */
    items: [],

    /** The wrapping tabs element. */
    tabs: [],

    /**
     * Initialize the showcase.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        var element;

        options = this.setOptions(options);
        this.element = element = this.createElement();

        // Nodes found in the page on initialization
        this.nodes = $(nodes);

        // The wrapping items element
        this.items = element.find(this.ns('items'));

        // The wrapping tabs element
        this.tabs = element.find(this.ns('tabs'));

        // The caption element
        this.caption = element.find(this.ns('caption'));

        // Blackout element if enabled
        if (options.blackout) {
            this.blackout = Blackout.instance();
        }

        // Initialize events
        this.addEvents([
            ['keydown', 'window', 'onKeydown'],
            ['click', 'document', 'onShow', '{selector}'],
            ['click', 'element', 'hide', this.ns('close')],
            ['click', 'element', 'next', this.ns('next')],
            ['click', 'element', 'prev', this.ns('prev')],
            ['click', 'element', 'onJump', this.ns('tabs') + ' a']
        ]);

        if (options.clickout) {
            this.addEvents([
                ['clickout', 'document', 'onHide', '{selector}'],
                ['clickout', 'element', 'onHide']
            ]);
        }

        if (options.swipe) {
            this.addEvents([
                ['swipeleft', 'element', 'next'],
                ['swiperight', 'element', 'prev']
            ]);
        }

        // Stop `transitionend` events from bubbling up when the showcase is resized
        this.addEvent(Toolkit.transitionEnd, 'element', function(e) {
            e.stopPropagation();
        }, this.ns('items'));

        this.initialize();
    },

    /**
     * Hide the showcase and reset inner elements.
     */
    hide: function() {
        this.fireEvent('hiding');

        if (this.blackout) {
            this.blackout.hide();
        }

        if (this.options.stopScroll) {
            $('body').removeClass('no-scroll');
        }

        this.element
            .conceal()
            .removeClass('is-single');

        this.items
            .removeAttr('style')
            .children('li')
                .conceal(true);

        this.fireEvent('hidden');
    },

    /**
     * Jump to a specific item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     */
    jump: function(index) {
        if (this.animating) {
            return;
        }

        index = $.bound(index, this.data.length);

        // Exit since transitions don't occur
        if (index === this.index) {
            return;
        }

        var self = this,
            element = this.element,
            caption = this.caption,
            list = this.items,
            listItems = list.children('li'),
            listItem = listItems.eq(index),
            items = this.data,
            item = items[index],
            deferred = $.Deferred();

        this.fireEvent('jumping', [this.index]);

        // Update tabs
        this.tabs.find('a')
            .removeClass('is-active')
            .eq(index)
                .addClass('is-active');

        // Reset previous styles
        listItems.conceal(true);
        caption.conceal(true);
        element
            .addClass('is-loading')
            .aria('busy', true)
            .reveal();

        // Setup deferred callbacks
        this.animating = true;

        deferred.always(function(width, height) {
            list.transitionend(function() {
                caption.html(item.title).reveal(true);
                listItem.reveal(true);
                self.position();
                self.animating = false;
            });

            self._resize(width, height);

            element
                .removeClass('is-loading')
                .aria('busy', false);

            listItem
                .data('width', width)
                .data('height', height);
        });

        deferred.fail(function() {
            element.addClass('has-failed');
            listItem.html(Toolkit.messages.error);
        });

        // Image already exists
        if (listItem.data('width')) {
            deferred.resolve(listItem.data('width'), listItem.data('height'));

        // Create image and animate
        } else {
            var img = new Image();
                img.src = item.image;
                img.onerror = function() {
                    deferred.reject(150, 150);
                };
                img.onload = function() {
                    deferred.resolve(this.width, this.height);
                    listItem.append(img);
                };
        }

        // Hide loader
        if (this.blackout) {
            this.blackout.hideLoader();
        }

        // Save state
        this.index = index;

        this.fireEvent('jumped', [index]);
    },

    /**
     * Go to the next item.
     */
    next: function() {
        this.jump(this.index + 1);
    },

    /**
     * Position the element in the middle of the screen.
     */
    position: function() {
        this.fireEvent('showing');

        if (this.blackout) {
            this.blackout.hideLoader();
        }

        this.element.reveal();

        this.fireEvent('shown');
    },

    /**
     * Go to the previous item.
     */
    prev: function() {
        this.jump(this.index - 1);
    },

    /**
     * Reveal the showcase after scraping for items data.
     * Will scrape data from the activating node.
     * If a category exists, scrape data from multiple nodes.
     *
     * @param {Element} node
     */
    show: function(node) {
        this.node = node = $(node);
        this.index = -1;

        var options = this.inheritOptions(this.options, node),
            read = this.readValue,
            category = read(node, options.getCategory),
            items = [],
            index = 0;

        // Multiple items based on category
        if (category) {
            for (var i = 0, x = 0, n; n = this.nodes[i]; i++) {
                if (read(n, options.getCategory) === category) {
                    if (node.is(n)) {
                        index = x;
                    }

                    items.push({
                        title: read(n, options.getTitle),
                        category: category,
                        image: read(n, options.getImage)
                    });

                    x++;
                }
            }

        // Single item
        } else {
            items.push({
                title: read(node, options.getTitle),
                category: category,
                image: read(node, options.getImage)
            });
        }

        if (this.blackout) {
            this.blackout.show();
        }

        if (options.stopScroll) {
            $('body').addClass('no-scroll');
        }

        this._buildItems(items);
        this.jump(index);
    },

    /**
     * Build the list of items and tabs based on the generated data.
     * Determine which elements to show and bind based on the data.
     *
     * @private
     * @param {Array} items
     */
    _buildItems: function(items) {
        this.data = items;
        this.items.empty();
        this.tabs.empty();

        for (var li, a, item, i = 0; item = items[i]; i++) {
            li = $('<li/>');
            li.appendTo(this.items);

            a = $('<a/>')
                .attr('href', 'javascript:;')
                .data('showcase-index', i);

            li = $('<li/>');
            li.appendTo(this.tabs).append(a);
        }

        if (items.length <= 1) {
            this.element.addClass('is-single');
        }

        this.fireEvent('load', [items]);
    },

    /**
     * Resize the showcase modal when it is larger than the current viewport.
     *
     * @private
     * @param {Number} width
     * @param {Number} height
     */
    _resize: function(width, height) {
        var gutter = (this.options.gutter * 2),
            wWidth = $(window).width() - gutter,
            wHeight = $(window).height() - gutter,
            ratio,
            diff;

        // Resize if the width is larger
        if (width > wWidth) {
            ratio = (width / height);
            diff = (width - wWidth);

            width = wWidth;
            height -= Math.round(diff / ratio);
        }

        // Resize again if the height is larger
        if (height > wHeight) {
            ratio = (height / width);
            diff = (height - wHeight);

            width -= Math.round(diff / ratio);
            height = wHeight;
        }

        this.items.css({
            width: width,
            height: height
        });
    },

    /**
     * Event handler for hide().
     *
     * @private
     * @param {jQuery.Event} e
     */
    onHide: function(e) {
        e.preventDefault();

        var element = this.element;

        // If the showcase is loading (AJAX) or is not shown, exit early
        // This stops cases where the blackout can be clicked early
        if (!element.is(':shown') || element.hasClass('is-loading')) {
            return;
        }

        this.hide();
    },

    /**
     * Event handler for jumping between items.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onJump: function(e) {
        e.preventDefault();

        this.jump($(e.target).data('showcase-index') || 0);
    },

    /**
     * Event handle for keyboard events.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onKeydown: function(e) {
        if (this.element.is(':shown')) {
            if ($.inArray(e.keyCode, [37, 38, 39, 40]) >= 0) {
                e.preventDefault();
            }

            switch (e.keyCode) {
                case 27: this.hide(); break;
                case 37: this.prev(); break;
                case 38: this.jump(0); break;
                case 39: this.next(); break;
                case 40: this.jump(-1); break;
            }
        }
    }

}, {
    blackout: true,
    stopScroll: true,
    clickout: true,
    swipe: Toolkit.isTouch,
    gutter: 50,
    getCategory: 'data-showcase',
    getImage: 'href',
    getTitle: 'title',
    template: function(bem) {
        return '<div class="' + bem('showcase') + '">' +
            '<div class="' + bem('showcase', 'inner') + '">' +
                '<ul class="' + bem('showcase', 'items') + '" data-showcase-items></ul>' +
                '<ol class="' + bem('showcase', 'tabs') + ' bullets" data-showcase-tabs></ol>' +
                '<button class="' + bem('showcase', 'prev') + '" data-showcase-prev></button>' +
                '<button class="' + bem('showcase', 'next') + '" data-showcase-next></button>' +
            '</div>' +
            '<button class="' + bem('showcase', 'close') + '" data-showcase-close><span class="x"></span></button>' +
            '<div class="' + bem('showcase', 'caption') + '" data-showcase-caption></div>' +
        '</div>';
    }
});

Toolkit.createPlugin('showcase', function(options) {
    return new Showcase(this, options);
}, true);

var Stalker = Toolkit.Stalker = Component.extend({
    name: 'Stalker',
    version: '2.1.7',

    /** Container to monitor scroll events on. */
    container: $(window),

    /** Targets to active when a marker is reached. */
    targets: [],

    /** Markers to compare against. */
    markers: [],

    /** Top value for all markers. */
    offsets: [],

    /**
     * Initialize the stalker.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        element = this.setElement(element);
        options = this.setOptions(options);

        if (!options.target || !options.marker) {
            throw new Error('A marker and target is required');
        }

        if (element.css('overflow') === 'auto') {
            this.container = element;
        }

        // Initialize events
        this.addEvents([
            ['scroll', 'container', $.throttle(this.onScroll.bind(this), options.throttle)],
            ['ready', 'document', 'onScroll']
        ]);

        this.initialize();

        // Gather markets and targets
        this.refresh();
    },

    /**
     * Remove classes before destroying.
     */
    destructor: function() {
        this.targets.removeClass('is-active');
        this.markers.removeClass('is-marked');
    },

    /**
     * Activate a target when a marker is entered.
     *
     * @param {Element} marker
     */
    activate: function(marker) {
        this.stalk(marker, 'activate');
    },

    /**
     * Deactivate a target when a marker is exited.
     *
     * @param {Element} marker
     */
    deactivate: function(marker) {
        this.stalk(marker, 'deactivate');
    },

    /**
     * Either active or deactivate a target based on the marker.
     *
     * @param {Element} marker
     * @param {String} type
     */
    stalk: function(marker, type) {
        marker = $(marker);

        // Stop all the unnecessary processing
        if (type === 'activate' && marker.hasClass('is-stalked')) {
            return;
        } else if (type === 'deactivate' && !marker.hasClass('is-stalked')) {
            return;
        }

        var options = this.options,
            targetBy = options.targetBy,
            markBy = options.markBy,
            target = this.targets.filter(function() {
                return $(this).attr(targetBy).replace('#', '') === marker.attr(markBy);
            }),
            before,
            after,
            method;

        if (type === 'activate') {
            before = 'activating';
            after = 'activated';
            method = 'addClass';
        } else {
            before = 'deactivating';
            after = 'deactivated';
            method = 'removeClass';
        }

        this.fireEvent(before, [marker, target]);

        marker[method]('is-stalked');
        target[method]('is-active');

        this.fireEvent(after, [marker, target]);
    },

    /**
     * Gather the targets and markers used for stalking.
     */
    refresh: function() {
        var isWindow = this.container.is(window),
            eTop = this.element.offset().top,
            offset,
            offsets = [];

        if (this.element.css('overflow') === 'auto' && !this.element.is('body')) {
            this.element[0].scrollTop = 0; // Set scroll to top so offsets are correct
        }

        this.targets = $(this.options.target);

        this.markers = $(this.options.marker).each(function(index, marker) {
            offset = $(marker).offset();

            if (!isWindow) {
                offset.top -= eTop;
            }

            offsets.push(offset);
        });

        this.offsets = offsets;
    },

    /**
     * While the element is being scrolled, notify the targets when a marker is reached.
     *
     * @private
     */
    onScroll: function() {
        var scroll = this.container.scrollTop(),
            offsets = this.offsets,
            onlyWithin = this.options.onlyWithin,
            threshold = this.options.threshold;

        this.markers.each(function(index, marker) {
            marker = $(marker);

            var offset = offsets[index],
                top = offset.top - threshold,
                bot = offset.top + marker.height() - threshold;

            // Scroll is within the marker
            if (
                (onlyWithin && scroll >= top && scroll <= bot) ||
                (!onlyWithin && scroll >= top)
            ) {
                this.activate(marker);

            // Scroll went outside the marker
            } else {
                this.deactivate(marker);
            }
        }.bind(this));

        this.fireEvent('scroll');
    }

}, {
    target: '',
    targetBy: 'href',
    marker: '',
    markBy: 'id',
    threshold: 50,
    throttle: 50,
    onlyWithin: true,
    applyToParent: true
});

Toolkit.createPlugin('stalker', function(options) {
    return new Stalker(this, options);
});

var Tab = Toolkit.Tab = Component.extend({
    name: 'Tab',
    version: '2.0.0',

    /** Index of the section currently displayed. */
    index: 0,

    /** Navigation element that contains the tabs. */
    nav: null,

    /** Collection of sections to toggle. */
    sections: [],

    /** Collection of tabs to trigger toggle. */
    tabs: [],

    /**
     * Initialize the tab.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        var sections, tabs, self = this;

        element = this.setElement(element);
        options = this.setOptions(options, element);

        // Determine cookie name
        if (!options.cookie) {
            options.cookie = element.attr('id');
        }

        // Find all the sections and set ARIA attributes
        this.sections = sections = element.find(this.ns('section')).each(function(index, section) {
            section = $(section);
            section
                .attr('role', 'tabpanel')
                .attr('id', section.attr('id') || self.id('section', index))
                .aria('labelledby', self.id('tab', index))
                .conceal();
        });

        // Find the nav and set ARIA attributes
        this.nav = element.find(this.ns('nav'))
            .attr('role', 'tablist');

        // Find the tabs within the nav and set ARIA attributes
        this.tabs = tabs = this.nav.find('a').each(function(index) {
            $(this)
                .data('tab-index', index)
                .attr({
                    role: 'tab',
                    id: self.id('tab', index)
                })
                .aria({
                    controls: sections.eq(index).attr('id'),
                    selected: false,
                    expanded: false
                })
                .removeClass('is-active');
        });

        // Initialize events
        this.addEvent('{mode}', 'element', 'onShow', this.ns('nav') + ' a');

        if (options.mode !== 'click' && options.preventDefault) {
            this.addEvent('click', 'element', function(e) {
                e.preventDefault();
            }, this.ns('nav') + ' a');
        }

        this.initialize();

        // Trigger default tab to display
        var index = null;

        if (options.persistState) {
            if (options.cookie && $.cookie) {
                index = $.cookie('toolkit.tab.' + options.cookie);
            }

            if (index === null && options.loadFragment && location.hash) {
                index = tabs.filter(function() {
                    return ($(this).attr('href') === location.hash);
                }).eq(0).data('tab-index');
            }
        }

        if (!tabs[index]) {
            index = options.defaultIndex;
        }

        this.jump(index);
    },

    /**
     * Reveal the first section when destroying.
     */
    destructor: function() {
        this.jump(0);
    },

    /**
     * Hide all sections.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.sections.conceal();

        this.fireEvent('hidden');
    },

    /**
     * Jump to a specific tab via index.
     *
     * @param {Number} index
     */
    jump: function(index) {
        this.show(this.tabs[$.bound(index, this.tabs.length)]);
    },

    /**
     * Show the content based on the tab. Can either pass an integer as the index in the collection,
     * or pass an element object for a tab in the collection.
     *
     * @param {jQuery} tab
     */
    show: function(tab) {
        tab = $(tab);

        var index = tab.data('tab-index'),
            section = this.sections.eq(index),
            options = this.options,
            url = this.readValue(tab, this.readOption(tab, 'getUrl'));

        this.fireEvent('showing', [this.index]);

        // Load content for AJAX requests
        if (url.substr(0, 10) !== 'javascript' && url.substr(0, 1) !== '#') {
            this.loadContent(url, { section: section });
        }

        // Toggle tabs
        this.tabs
            .aria('toggled', false)
            .removeClass('is-active');

        // Toggle sections
        if (index === this.index && options.collapsible) {
            if (section.is(':shown')) {
                section.conceal();

            } else {
                tab.aria('toggled', true).addClass('is-active');
                section.reveal();
            }
        } else {
            this.hide();

            tab.aria('toggled', true).addClass('is-active');
            section.reveal();
        }

        // Persist the state using a cookie
        if (options.persistState && $.cookie) {
            $.cookie('toolkit.tab.' + options.cookie, index, {
                expires: options.cookieDuration
            });
        }

        this.index = index;
        this.node = tab;

        this.fireEvent('shown', [index]);
    },

    /**
     * {@inheritdoc}
     */
    onRequestBefore: function(xhr) {
        xhr.params.section
            .html(Toolkit.messages.loading)
            .addClass('is-loading')
            .aria('busy', true);
    },

    /**
     * {@inheritdoc}
     */
    onRequestDone: function(response, status, xhr) {
        if (xhr.cache) {
            this.cache[xhr.url] = response;
        }

        this.fireEvent('load', [response]);

        xhr.params.section
            .html(response)
            .removeClass('is-loading')
            .aria('busy', false);
    },

    /**
     * {@inheritdoc}
     */
    onRequestFail: function(xhr) {
        xhr.params.section
            .html(Toolkit.messages.error)
            .removeClass('is-loading')
            .addClass('has-failed')
            .aria('busy', false);
    },

    /**
     * Event callback for tab element click.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onShow: function(e) {
        if (this.options.preventDefault || e.currentTarget.getAttribute('href').substr(0, 1) !== '#') {
            e.preventDefault();
        }

        this.show(e.currentTarget);
    }

}, {
    mode: 'click',
    collapsible: false,
    defaultIndex: 0,
    persistState: false,
    preventDefault: true,
    loadFragment: true,
    cookie: null,
    cookieDuration: 30,
    getUrl: 'href'
});

Toolkit.createPlugin('tab', function(options) {
    return new Tab(this, options);
});

var Toast = Toolkit.Toast = CompositeComponent.extend({
    name: 'Toast',
    version: '2.1.0',

    /**
     * Initialize the toast.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        this.nodes = element = $(element); // Set to nodes so instances are unset during destroy()
        options = this.setOptions(options, element);

        // Create the toasts wrapper
        this.createWrapper()
            .addClass(options.position)
            .attr('role', 'log')
            .aria({
                relevant: 'additions',
                hidden: 'false'
            });

        this.initialize();
    },

    /**
     * Create a toast element, insert content into it, and append it to the container.
     *
     * @param {*} content
     * @param {Object} [options]
     */
    create: function(content, options) {
        options = $.extend({}, this.options, options || {});

        var self = this,
            toast = this.render(options.template)
                .addClass(options.animation)
                .attr('role', 'note')
                .html(content)
                .conceal()
                .prependTo(this.wrapper);

        this.fireEvent('create', [toast]);

        // Set a timeout to trigger show transition
        setTimeout(function() {
            self.show(toast);
        }, 15); // IE needs a minimum of 15

        // Set a timeout to remove the toast
        if (options.duration) {
            setTimeout(function() {
                self.hide(toast);
            }, options.duration + 15);
        }
    },

    /**
     * Hide the toast after the duration is up.
     * Also remove the element from the DOM once the transition is complete.
     *
     * @param {jQuery} element
     */
    hide: function(element) {
        element = $(element);

        // Pass the element since it gets removed
        this.fireEvent('hiding', [element]);

        element.transitionend(function() {
            element.remove();
            this.fireEvent('hidden');
        }.bind(this)).conceal();
    },

    /**
     * Reveal the toast after it has been placed in the container.
     *
     * @param {jQuery} element
     */
    show: function(element) {
        element = $(element);

        this.fireEvent('showing', [element]);

        element.reveal();

        this.fireEvent('shown', [element]);
    }

}, {
    position: 'bottom-left',
    animation: 'slide-up',
    duration: 5000,
    wrapperClass: function(bem) {
        return bem('toasts');
    },
    template: function(bem) {
        return '<div class="' + bem('toast') + '"></div>';
    }
});

Toolkit.createPlugin('toast', function(options) {
    return new Toast(this, options);
});

var TypeAhead = Toolkit.TypeAhead = TemplateComponent.extend({
    name: 'TypeAhead',
    version: '2.1.3',

    /** Current index in the drop menu while cycling. */
    index: -1,

    /** The input field to listen against. */
    input: null,

    /** List of item data to render in the drop menu. */
    items: [],

    /** The shadow input field. */
    shadow: null,

    /** Current term in the input field to match against. */
    term: '',

    /** Lookup throttle timer. */
    timer: null,

    /** The element that wraps the input when `shadow` is enabled. */
    wrapper: null,

    /**
     * Initialize the type ahead.
     *
     * @param {jQuery} input
     * @param {Object} [options]
     */
    constructor: function(input, options) {
        input = $(input);

        if (input.prop('tagName').toLowerCase() !== 'input') {
            throw new Error('TypeAhead must be initialized on an input field');
        }

        var self = this;

        options = this.setOptions(options, input);
        this.element = this.createElement()
            .attr('role', 'listbox')
            .aria('multiselectable', false);

        // The input field to listen against
        this.input = input;

        // Use default callbacks
        $.each({ sorter: 'sort', matcher: 'match', builder: 'build' }, function(key, fn) {
            if (options[key] === false) {
                return;
            }

            var callback;

            if (options[key] === null || $.type(options[key]) !== 'function') {
                callback = self[fn];
            } else {
                callback = options[key];
            }

            options[key] = callback.bind(self);
        });

        // Prefetch source data from URL
        if (options.prefetch && $.type(options.source) === 'string') {
            var url = options.source;

            $.getJSON(url, options.query, function(items) {
                self.cache[url] = items;
            });
        }

        // Enable shadow inputs
        if (options.shadow) {
            this.wrapper = this.render(this.options.shadowTemplate);

            this.shadow = this.input.clone()
                .addClass('is-shadow')
                .removeAttr('id')
                .prop('readonly', true)
                .aria('readonly', true);

            this.input
                .addClass('not-shadow')
                .replaceWith(this.wrapper);

            this.wrapper
                .append(this.shadow)
                .append(this.input);
        }

        // Set ARIA after shadow so that attributes are not inherited
        input
            .attr({
                autocomplete: 'off',
                autocapitalize: 'off',
                autocorrect: 'off',
                spellcheck: 'false',
                role: 'combobox'
            })
            .aria({
                autocomplete: 'list',
                owns: this.element.attr('id'),
                expanded: false
            });

        // Initialize events
        this.addEvents([
            ['keyup', 'input', 'onLookup'],
            ['keydown', 'input', 'onCycle'],
            ['clickout', 'element', 'hide'],
            ['resize', 'window', $.debounce(this.onHide.bind(this))]
        ]);

        this.initialize();
    },

    /**
     * Remove the shadow before destroying.
     */
    destructor: function() {
        if (this.shadow) {
            this.shadow.parent().replaceWith(this.input);
            this.input.removeClass('not-shadow');
        }
    },

    /**
     * Build the anchor link that will be used in the list.
     *
     * @param {Object} item
     * @returns {jQuery}
     */
    build: function(item) {
        var a = $('<a/>', {
            href: 'javascript:;',
            role: 'option',
            'aria-selected': 'false'
        });

        a.append( this.render(this.options.titleTemplate).html(this.highlight(item.title)) );

        if (item.description) {
            a.append( this.render(this.options.descTemplate).html(item.description) );
        }

        return a;
    },

    /**
     * Hide the list and reset shadow.
     */
    hide: function() {
        this.fireEvent('hiding');

        if (this.shadow) {
            this.shadow.val('');
        }

        this.input.aria('expanded', false);
        this.element.conceal();

        this.fireEvent('hidden');
    },

    /**
     * Highlight the current term within the item string.
     * Split multi-word terms to highlight separately.
     *
     * @param {String} item
     * @returns {String}
     */
    highlight: function(item) {
        var terms = this.term.replace(/[\-\[\]\{\}()*+?.,\\^$|#]/g, '\\$&').split(' '),
            options = this.options,
            callback = function(match) {
                return this.render(options.highlightTemplate).html(match).toString();
            }.bind(this);

        for (var i = 0, t; t = terms[i]; i++) {
            item = item.replace(new RegExp(t, 'ig'), callback);
        }

        return item;
    },

    /**
     * Load the list of items to use for look ups.
     * Trigger different actions depending on the type of source.
     *
     * @param {String} term
     */
    lookup: function(term) {
        this.term = term;
        this.timer = setTimeout(this.onFind.bind(this), this.options.throttle);
    },

    /**
     * Match an item if it contains the term.
     *
     * @param {Object} item
     * @param {String} term
     * @returns {bool}
     */
    match: function(item, term) {
        return (item.title.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    },

    /**
     * Position the menu below the input.
     */
    position: function() {
        if (!this.items.length) {
            this.hide();
            return;
        }

        this.fireEvent('showing');

        var iPos = this.input.offset();

        this.element
            .css('top', iPos.top + this.input.outerHeight())
            .css(Toolkit.isRTL ? 'right' : 'left', iPos.left)
            .reveal();

        this.input.aria('expanded', true);

        this.fireEvent('shown');
    },

    /**
     * Rewind the cycle pointer to the beginning.
     */
    rewind: function() {
        this.index = -1;
        this.element.find('li').removeClass('is-active');
    },

    /**
     * Select an item in the list.
     *
     * @param {Number} index
     * @param {String} [event]
     */
    select: function(index, event) {
        this.index = index;

        var rows = this.element.find('li');

        rows
            .removeClass('is-active')
            .find('a')
                .aria('selected', false);

        // Select
        if (index >= 0) {
            if (this.items[index]) {
                var item = this.items[index];

                rows.eq(index)
                    .addClass('is-active')
                    .find('a')
                        .aria('selected', true);

                this.input.val(item.title);

                this.fireEvent(event || 'select', [item, index]);
            }

        // Reset
        } else {
            this.input.val(this.term);

            this.fireEvent('reset');
        }
    },

    /**
     * Sort the items.
     *
     * @param {Array} items
     * @returns {Array}
     */
    sort: function(items) {
        return items.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });
    },

    /**
     * Process the list of items be generating new elements and positioning below the input.
     *
     * @param {Array} items
     */
    source: function(items) {
        if (!this.term.length || !items.length) {
            this.hide();
            return;
        }

        var options = this.options,
            term = this.term,
            categories = { _empty_: [] },
            item,
            list = $('<ul/>');

        // Reset
        this.items = [];
        this.index = -1;

        // Sort and match the list of items
        if ($.type(options.sorter) === 'function') {
            items = options.sorter(items);
        }

        if ($.type(options.matcher) === 'function') {
            items = items.filter(function(item) {
                return options.matcher(item, term);
            });
        }

        // Group the items into categories
        for (var i = 0; item = items[i]; i++) {
            if (item.category) {
                if (!categories[item.category]) {
                    categories[item.category] = [];
                }

                categories[item.category].push(item);
            } else {
                categories._empty_.push(item);
            }
        }

        // Loop through the items and build the markup
        var results = [],
            count = 0;

        $.each(categories, function(category, items) {
            var elements = [];

            if (category !== '_empty_') {
                results.push(null);

                elements.push(
                    this.render(options.headingTemplate).append( $('<span/>', { text: category }) )
                );
            }

            for (var i = 0, a; item = items[i]; i++) {
                if (count >= options.itemLimit) {
                    break;
                }

                a = options.builder(item);
                a.on({
                    mouseover: this.rewind.bind(this),
                    click: $.proxy(this.onSelect, this, results.length)
                });

                elements.push( $('<li/>').append(a) );
                results.push(item);
                count++;
            }

            list.append(elements);
        }.bind(this));

        // Append list
        this.element.empty().append(list);

        // Set the current result set to the items list
        // This will be used for index cycling
        this.items = results;

        // Cache the result set to the term
        // Filter out null categories so that we can re-use the cache
        this.cache[term.toLowerCase()] = results.filter(function(item) {
            return (item !== null);
        });

        this.fireEvent('load');

        // Apply the shadow text
        this._shadow();

        // Position the list
        this.position();
    },

    /**
     * Monitor the current input term to determine the shadow text.
     * Shadow text will reference the term cache.
     *
     * @private
     */
    _shadow: function() {
        if (!this.shadow) {
            return;
        }

        var term = this.input.val(),
            termLower = term.toLowerCase(),
            value = '';

        if (this.cache[termLower] && this.cache[termLower][0]) {
            var title = this.cache[termLower][0].title;

            if (title.toLowerCase().indexOf(termLower) === 0) {
                value = term + title.substr(term.length, (title.length - term.length));
            }
        }

        this.shadow.val(value);
    },

    /**
     * Cycle through the items in the list when an arrow key, esc or enter is released.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onCycle: function(e) {
        var items = this.items,
            length = Math.min(this.options.itemLimit, Math.max(0, items.length)),
            event = 'cycle';

        if (!length || !this.element.is(':shown')) {
            return;
        }

        switch (e.keyCode) {
            // Cycle upwards (up)
            case 38:
                this.index -= (items[this.index - 1] ? 1 : 2); // category check

                if (this.index < 0) {
                    this.index = length;
                }
            break;

            // Cycle downwards (down)
            case 40:
                this.index += (items[this.index + 1] ? 1 : 2); // category check

                if (this.index >= length) {
                    this.index = -1;
                }
            break;

            // Select first (tab)
            case 9:
                e.preventDefault();

                var i = 0;

                while (!this.items[i]) {
                    i++;
                }

                event = 'select';
                this.index = i;
                this.hide();
            break;

            // Select current index (enter)
            case 13:
                e.preventDefault();

                event = 'select';
                this.hide();
            break;

            // Reset (esc)
            case 27:
                this.index = -1;
                this.hide();
            break;

            // Cancel others
            default:
            return;
        }

        if (this.shadow) {
            this.shadow.val('');
        }

        // Select the item
        this.select(this.index, event);
    },

    /**
     * Event handler called for a lookup.
     */
    onFind: function() {
        var term = this.term,
            options = this.options,
            sourceType = $.type(options.source);

        // Check the cache first
        if (this.cache[term.toLowerCase()]) {
            this.source(this.cache[term.toLowerCase()]);

        // Use the response of an AJAX request
        } else if (sourceType === 'string') {
            var url = options.source,
                cache = this.cache[url];

            if (cache) {
                this.source(cache);
            } else {
                var query = options.query;
                query.term = term;

                $.getJSON(url, query, this.source.bind(this));
            }

        // Use a literal array list
        } else if (sourceType === 'array') {
            this.source(options.source);

        // Use the return of a function
        } else if (sourceType === 'function') {
            var response = options.source.call(this);

            if (response) {
                this.source(response);
            }
        } else {
            throw new Error('Invalid TypeAhead source type');
        }
    },

    /**
     * Lookup items based on the current input value.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onLookup: function(e) {
        if ($.inArray(e.keyCode, [38, 40, 27, 9, 13]) >= 0) {
            return; // Handle with onCycle()
        }

        clearTimeout(this.timer);

        var term = this.input.val().trim();

        if (term.length < this.options.minLength) {
            this.fireEvent('reset');
            this.hide();

        } else {
            this._shadow();
            this.lookup(term);
        }
    },

    /**
     * Event handler to select an item from the list.
     *
     * @private
     * @param {Number} index
     */
    onSelect: function(index) {
        this.select(index);
        this.hide();
    }

}, {
    source: [],
    minLength: 1,
    itemLimit: 15,
    throttle: 250,
    prefetch: false,
    shadow: false,
    query: {},
    template: function(bem) {
        return '<div class="' + bem('type-ahead') + '"></div>';
    },
    shadowTemplate: function(bem) {
        return '<div class="' + bem('type-ahead', 'shadow') + '"></div>';
    },
    titleTemplate: function(bem) {
        return '<span class="' + bem('type-ahead', 'title') + '"></span>';
    },
    descTemplate: function(bem) {
        return '<span class="' + bem('type-ahead', 'desc') + '"></span>';
    },
    highlightTemplate: function(bem) {
        return '<mark class="' + bem('type-ahead', 'highlight') + '"></mark>';
    },
    headingTemplate: function(bem) {
        return '<li class="' + bem('type-ahead', 'heading') + '"></li>';
    },

    // Callbacks
    sorter: null,
    matcher: null,
    builder: null
});

Toolkit.createPlugin('typeAhead', function(options) {
    return new TypeAhead(this, options);
});
    // An empty file that includes all flags into the Toolkit scope.
    // It does not return a value.

/**
 * An event that triggers when a vertical browser window resize occurs.
 *
 * @returns {Object}
 */
$.event.special.verticalresize = (function() {
    var win = $(window),
        lastHeight = win.height();

    function handleResize(e) {
        var currentHeight = win.height();

        if (currentHeight !== lastHeight) {
            lastHeight = currentHeight;

            $(e.target).trigger('verticalresize');
        }
    }

    return {
        setup: function() {
            win.on('resize', handleResize);
        },
        teardown: function() {
            win.off('resize', handleResize);
        }
    };
})();
    // An empty file that includes all events into the jQuery scope.
    // It does not return a value.
    // An empty file that includes all extensions into the jQuery scope.
    // It does not return a value.

})(jQuery, window, document);
