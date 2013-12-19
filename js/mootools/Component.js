/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Component = new Class({
    Implements: [Events, Options],
    Binds: ['__show', '__hide', 'position'],

    /** Cached data */
    cache: {},

    /** Is class functionality enabled? */
    enabled: true,

    /** The template element or targeted DOM element used for interaction */
    element: null,

    /** Elements that were bound with events that activate functionality */
    nodes: null,

    /** Current node that activated the component */
    node: null,

    /** Default options */
    options: {
        context: null,
        delegate: '',
        className: '',
        animation: '',
        mode: 'click',

        // Ajax
        errorMessage: null,
        loadingMessage: null,

        // Templates
        template: '',
        templateFrom: '',

        // Events
        onInit: null,
        onHide: null,
        onShow: null,
        onLoad: null
    },

    /**
     * Set options.
     *
     * @param {Object} [options]
     */
    initialize: function(options) {
        this.setOptions(options || {});
    },

    /**
     * Will either apply events via delegation or directly to an element.
     *
     * @returns {Toolkit.Component}
     */
    bindEvents: function() {
        var options = this.options,
            event = (options.mode === 'click' ? 'click' : 'mouseenter'),
            context;

        // Delegation
        if (options.delegate) {
            event += ':relay(' + options.delegate + ')';
            context = document.id(options.context || document.body);

        // Direct
        } else if (this.element) {
            context = this.element;
        }

        if (context) {
            context.addEvent(event, this.__show);
        }

        return this;
    },

    /**
     * Return the class name of the current object.
     *
     * @returns {String}
     */
    className: function() {
        return Object.keyOf(window.Toolkit, this.$constructor);
    },

    /**
     * Create the element from the template.
     *
     * @returns {Toolkit.Component}
     */
    createElement: function() {
        var options = this.options,
            template;

        if (this.element) {
            return this;
        }

        // Use another element as the template
        if (options.templateFrom) {
            if (typeOf(options.templateFrom) === 'element') {
                template = options.templateFrom;
            } else {
                template = document.getElement(options.templateFrom);
            }
        }

        // From a string
        if (!template && options.template) {
            template = this.parseTemplate(options.template);

            if (template) {
                template.conceal().inject(document.body);
            }
        }

        // Store it in the DOM
        if (template) {
            this.setElement(template);
        } else {
            throw new Error(this.className() + ' failed to create template element');
        }

        return this;
    },

    /**
     * Disable component.
     *
     * @returns {Toolkit.Component}
     */
    disable: function() {
        this.enabled = false;

        return this;
    },

    /**
     * Enable component.
     *
     * @returns {Toolkit.Component}
     */
    enable: function() {
        this.enabled = true;

        return this;
    },

    /**
     * Hide the element and trigger events or callbacks.
     *
     * @param {Function} [callback]
     * @returns {Toolkit.Component}
     */
    hide: function(callback) {
        if (this.isVisible()) {
            this.element.conceal();

            if (typeOf(callback) === 'function') {
                callback();
            }

            this.fireEvent('hide');
        }

        return this;
    },

    /**
     * Return true if the element is visible.
     *
     * @returns {bool}
     */
    isVisible: function() {
        return (this.element && this.element.isShown());
    },

    /**
     * Parse the template string into a set of DOM elements.
     *
     * @param {String|Element} template
     * @returns {Element}
     */
    parseTemplate: function(template) {
        if (!template) {
            return null;
        }

        // If template is an element, use it
        if (typeOf(template) === 'element') {
            return template;
        }

        // Elements.from() returns an array, so grab the first node
        var element = Elements.from(template);

        if (element[0]) {
            return element[0];
        }

        throw new Error(this.className() + ' template failed to parse');
    },

    /**
     * Set the content and position the element.
     *
     * @private
     * @param {String} content
     * @returns {Toolkit.Component}
     */
    position: function(content) {
        this.element.set('html', content);
        this.fireEvent('load', content);

        return this;
    },

    /**
     * Attempt to read a value from an element using the query.
     * Query can either be an attribute name, or a callback function.
     *
     * @param {Element} element
     * @param {String|Function} query
     * @returns {String}
     */
    readValue: function(element, query) {
        if (!query) {
            return null;
        }

        if (typeOf(query) === 'function') {
            return query.call(this, element);
        }

        return element.get(query);
    },

    /**
     * Request data from a URL and handle all the possible scenarios.
     *
     * @param {String} url
     * @param {Function} before
     * @param {Function} done
     * @param {Function} fail
     * @returns {Toolkit.Component}
     */
    requestData: function(url, before, done, fail) {
        if (this.cache[url]) {
            return this;
        }

        var ajax = {
            url: url,
            method: 'get',
            evalScripts: true,

            onRequest: before || function() {
                this.cache[url] = true;

                // Does not apply to all components
                if (this.options.showLoading) {
                    this.element.addClass(Toolkit.options.isPrefix + 'loading');

                    this.position(this._loadingTemplate());
                }
            }.bind(this),

            onSuccess: done || function(response) {
                this.cache[url] = response;

                // Does not apply to all components
                if (this.options.showLoading) {
                    this.element.removeClass(Toolkit.options.isPrefix + 'loading');
                }

                this.position(response);
            }.bind(this),

            onFailure: fail || function() {
                delete this.cache[url];

                this.element
                    .removeClass(Toolkit.options.isPrefix + 'loading')
                    .addClass(Toolkit.options.hasPrefix + 'failed');

                this.position(this._errorTemplate());
            }.bind(this)
        };

        if (typeOf(this.options.ajax) === 'object') {
            ajax = Object.merge(this.options.ajax, ajax);
        }

        new Request(ajax).get();

        return this;
    },

    /**
     * Set the primary element to interact with.
     * Apply optional class names if available.
     *
     * @param {String|Element} element
     * @returns {Toolkit.Component}
     */
    setElement: function(element) {
        if (typeOf(element) === 'string') {
            element = document.getElement(element); // Uses #id format
        }

        this.element = element;
        this.options.template = false;

        // Add a class name
        if (this.options.className) {
            this.element.addClass(this.options.className);
        }

        // Enable animations
        if (this.options.animation) {
            this.element.addClass(this.options.animation);
        }

        return this;
    },

    /**
     * Store the list of elements (referred to as nodes) that will be bound with activation events.
     * These are usually the elements returned from an Elements constructor.
     *
     * @param {Elements} nodes
     * @returns {Toolkit.Component}
     */
    setNodes: function(nodes) {
        this.nodes = nodes;

        return this;
    },

    /**
     * Override options when necessary.
     * Code taken from Options class.
     *
     * @returns {Toolkit.Component}
     */
    setOptions: function() {
        var options = Object.merge.apply(null, [{}, this.options].append(arguments));

        // Reset for touch devices
        if (Toolkit.isTouch && options.mode === 'hover') {
            options.mode = 'click';
        }

		if (this.addEvent) {
            for (var option in options){
                if (typeOf(options[option]) !== 'function' || !(/^on[A-Z]/).test(option)) {
                    continue;
                }

                this.addEvent(option, options[option]);
                delete options[option];
            }
        }

        this.options = options;

        return this;
    },

    /**
     * Show the element and store the node.
     *
     * @param {Element} node
     * @returns {Toolkit.Component}
     */
    show: function(node) {
        this.node = node;
        this.element.reveal();
        this.fireEvent('show');

        return this;
    },

    /**
     * Return the element when the class is passed as an argument.
     *
     * @returns {Element}
     */
    toElement: function() {
        return this.element;
    },

    /**
     * Return a DOM element for error messages.
     *
     * @private
     * @returns {Element}
     */
    _errorTemplate: function() {
        return new Element('div.' + this.className().toLowerCase() + '-error', {
            text: this.options.errorMessage || Toolkit.messages.error
        });
    }.protect(),

    /**
     * Return a DOM element for loading messages.
     *
     * @private
     * @returns {Element}
     */
    _loadingTemplate: function() {
        return new Element('div.' + this.className().toLowerCase() + '-loading', {
            text: this.options.loadingMessage || Toolkit.messages.loading
        });
    }.protect(),

    /**
     * Event handler to hide an element.
     *
     * @private
     * @param {DOMEvent} e
     */
    __hide: function(e) {
        if (typeOf(e) === 'domevent') {
            e.preventDefault();
        }

        this.hide();
    },

    /**
     * Event handler to show an element via node hover or click.
     *
     * @private
     * @param {DOMEvent} e
     * @param {Element} node
     */
    __show: function(e, node) {
        if (typeOf(e) === 'domevent') {
            e.preventDefault();
        }

        if (!this.enabled) {
            return;
        }

        node = node || e.target;

        if (this.isVisible()) {
            if (this.options.mode === 'click') {
                this.hide();
            }

            // Exit if the same node
            if (node === this.node) {
                return;
            }
        }

        this.show(node);
    }

});

})();