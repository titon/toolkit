define([
    'jquery',
    './class'
], function($, Toolkit) {

Toolkit.Base = Toolkit.Class.extend({

    /** Name of the plugin. Must match the object declaration. */
    name: 'Base',

    /** Current version of the plugin. */
    version: '1.5.0',

    /** Cached data and AJAX requests. */
    cache: {},

    /** Is the plugin enabled? */
    enabled: false,

    /** Events and functions to bind. */
    events: {},

    /** Static options defined during construction. */
    options: {},

    /** Dynamic options generated at runtime. */
    runtime: {},

    /** List of hooks grouped by type. */
    __hooks: {},

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
     * Loop through the events object and attach events to the specified selector in the correct context.
     * Take into account window, document, and delegation.
     *
     * @param {String} type
     */
    bindEvents: function(type) {
        var self = this,
            options = this.options,
            event,
            keys,
            context,
            selector,
            funcs,
            win = $(window),
            doc = $(document);

        // event window = func          Bind window event
        // event document = func        Bind document event
        // ready document = func        Bind DOM ready event
        // event property = func        Bind event to collection that matches class property
        // event context .class = func  Bind delegated events to class within context
        $.each(this.events, function(key, value) {
            funcs = $.isArray(value) ? value : [value];

            // Replace tokens
            key = key.replace('{mode}', options.mode);
            key = key.replace('{selector}', self.nodes ? self.nodes.selector : '');

            // Extract arguments
            keys = key.split(' ');
            event = keys.shift();
            context = keys.shift();
            selector = keys.join(' ').replace('@', Toolkit.vendor);

            // Determine the correct context
            if (self[context]) {
                context = self[context];
            } else if (context === 'window') {
                context = win;
            } else if (context === 'document') {
                context = doc;
            }

            $.each(funcs, function(i, func) {
                if (!$.isFunction(func)) {
                    func = self[func].bind(self);
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
        });
    },

    /**
     * Destroy the plugin by disabling events, removing elements, and deleting the instance.
     */
    destroy: function() {
        this.fireEvent('destroy');

        // Hide and remove active state
        if (this.hide) {
            this.hide();
        }

        // Trigger destructor
        if (this.destructor) {
            this.destructor();
        }

        // Remove events
        this.disable();
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
                    return false;
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

        return opts;
    }

});

return Toolkit;
});