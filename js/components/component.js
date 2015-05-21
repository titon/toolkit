/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    '../base',
    '../extensions/aria',
    '../extensions/cache',
    '../extensions/conceal',
    '../extensions/reveal',
    '../extensions/toolkit'
], function($, Toolkit) {

/**
 * Class for elements already embedded in the page.
 */
Toolkit.Component = Toolkit.Base.extend({
    name: 'Component',
    version: '2.1.0',

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
        Toolkit.Base.prototype.fireEvent.call(this, type, args);

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
     * If the content is a literal string, set it directly.
     *
     * @param {String} content
     * @param {Object} [params]
     */
    loadContent: function(content, params) {
        var ajax = false;

        // Load content from an element matching ID
        if (content.match(/^#[a-z0-9_\-\.:]+$/i)) {
            content = $(content).html();

        // Load content from an AJAX request
        // Matches http://, https://, /url, and many others
        } else if (content.match(/^([a-z]+:)?\/\//) || content.match(/^\/[\w\-\.\/]+/i)) {
            ajax = true;
        }

        if (this.cache[content]) {
            this.position(this.cache[content]);

        } else if (ajax) {
            this.requestData(content, params);

        } else {
            this.position(content);
        }
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

        var opts = Toolkit.Base.prototype.setOptions.call(this, options);

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
 * Class for elements that are rendered through templates.
 */
Toolkit.TemplateComponent = Toolkit.Component.extend({

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
        Toolkit.Component.prototype.doDestroy.call(this);

        this.element.remove();
    }

}, {
    template: '',
    templateFrom: ''
});

/**
 * Class for managing multiple elements that are rendered through templates.
 */
Toolkit.CompositeComponent = Toolkit.TemplateComponent.extend({

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
        var template = Toolkit.TemplateComponent.prototype.createElement.call(this, options);

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

return Toolkit.Component;
});
