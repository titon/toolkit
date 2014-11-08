define([
    'jquery',
    '../base',
    '../extensions/aria',
    '../extensions/conceal',
    '../extensions/reveal',
    '../extensions/toolkit'
], function($, Toolkit) {

Toolkit.Component = Toolkit.Base.extend({
    name: 'Component',
    version: '1.4.1',

    /** Whether the element was created automatically or not. */
    created: false,

    /** The target element. Either created through a template, or embedded in the DOM. */
    element: null,

    /** Collection of elements related to the component. */
    elements: [],

    /** The element that activated the component. */
    node: null,

    /** Collection of nodes. */
    nodes: [],

    /**
     * A basic constructor that sets an element and its options.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        this.element = element = $(element);
        this.options = this.setOptions(options, element);
    },

    /**
     * Create an element from the `template` or `templateFrom` option.
     *
     * @returns {jQuery}
     */
    createElement: function() {
        var template, options = this.options;

        // Use another element as the template
        if (options.templateFrom) {
            template = $(options.templateFrom);
        }

        // From a string
        if ((!template || !template.length) && options.template) {
            template = $(options.template).hide().addClass('hide').appendTo('body');
        }

        if (!template) {
            throw new Error('Failed to create template element');
        }

        // Add a class name
        if (options.className) {
            template.addClass(options.className);
        }

        // Enable animations
        if (options.animation) {
            template.addClass(options.animation);
        }

        // Set a flag so we know if the element was created or embedded
        this.created = true;

        return template.attr('id', this.id());
    },

    /**
     * {@inheritdoc}
     */
    destroy: function() {

        // Remove cached plugin instances
        var key = this.keyName;

        if (this.nodes.length) {
            this.nodes.removeData('toolkit.' + key);

            delete Toolkit.cache[key + ':' + this.nodes.selector];

        } else if (this.element.length) {
            this.element.removeData('toolkit.' + key);
        }

        // Trigger destructors
        Toolkit.Base.prototype.destroy.call(this);

        // Remove element and state only if it was created
        if (this.created) {
            this.hide();
            this.element.remove();
        }
    },

    /**
     * Trigger all hooks and any DOM events attached to the `element` or `node`.
     *
     * @param {String} type
     * @param {Array} [args]
     */
    fireEvent: function(type, args) {
        Toolkit.Base.prototype.fireEvent.call(this, type, args);

        var element = this.element,
            node = this.node,
            event = $.Event(type + '.toolkit.' + this.keyName);
            event.context = this;

        // Trigger event on the element and the node
        if (element && element.length) {
            element.trigger(event, args || []);
        }

        if (node && node.length) {
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
        this.hide();

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
     * Request data from a URL and handle all the possible scenarios.
     *
     * @param {Object} options
     * @param {Object} params
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
     * After merging options with the default options,
     * inherit options from an elements data attributes.
     *
     * @param {Object} [options]
     * @param {jQuery} [inheritFrom]
     * @returns {Object}
     */
    setOptions: function(options, inheritFrom) {
        var opts = Toolkit.Base.prototype.setOptions.call(this, options);

        // Inherit from element data attributes
        if (inheritFrom) {
            opts = this.inheritOptions(opts, inheritFrom);
        }

        // Convert hover to mouseenter
        if (opts.mode && opts.mode === 'hover') {
            opts.mode = Toolkit.isTouch ? 'click' : 'mouseenter';
        }

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
    },

    /**
     * Event handler for toggling an element through click or hover events.
     *
     * @param {jQuery.Event} e
     * @private
     */
    onShowToggle: function(e) {
        var node = $(e.currentTarget),
            isNode = (this.node && node[0] === this.node[0]);

        if (this.element && this.element.is(':shown')) {

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
    context: null,
    className: '',
    template: '',
    templateFrom: ''
});

return Toolkit;
});