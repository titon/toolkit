/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    './toolkit',
    './class'
], function($, Toolkit, Class) {

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

return Base;
});
