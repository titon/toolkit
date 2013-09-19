/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Component = new Class({
    Implements: [Events, Options],
    Binds: ['_show', '_hide', '_position'],

    /** Cached data */
    cache: {},

    /** The template element or targeted DOM element used for interaction */
    element: null,

    /** Elements that were bound with events that activate functionality */
    nodes: null,

    /** Current node that activated the component */
    node: null,

    /**
     * Default options.
     *
     *    context          - (element) The element the component will display in (defaults to document.body)
     *    delegate         - (string) CSS query of elements to attach events to (overrides single element events)
     *    className        - (string) Class name to append to element
     *    animation        - (string) The name of the animation class to use
     *    mode             - (string) Either "hover" or "click"
     *    errorMessage     - (string) Error message when AJAX calls fail
     *    loadingMessage   - (string) Loading message while waiting for AJAX calls
     *    template         - (string) HTML string template that will be converted to DOM nodes
     *    templateFrom     - (string) ID of an element to use as the template
     *    parseTemplate    - (bool) Whether to parse the template during initialization
     *    onInit           - (function) Callback to trigger when class is instantiated
     *    onHide           - (function) Callback to trigger when the element is hidden
     *    onShow           - (function) Callback to trigger when the element is shown
     */
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
        parseTemplate: true,

        // Events
        onInit: null,
        onHide: null,
        onShow: null
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
     * Return the class name of the current object.
     *
     * @returns {String}
     */
    className: function() {
        return Object.keyOf(window.Titon, this.$constructor);
    },

    /**
     * Create the element from the template.
     *
     * @returns {Titon.Component}
     */
    createElement: function() {
        var options = this.options,
            template;

        if (!options.parseTemplate || this.element) {
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
     * Disable activation events.
     *
     * @returns {Titon.Component}
     */
    disable: function() {
        return this._toggleEvents(false);
    },

    /**
     * Enable activation events.
     *
     * @returns {Titon.Component}
     */
    enable: function() {
        return this._toggleEvents(true);
    },

    /**
     * Attempt to read a value from an element using the query.
     * Query can either be an attribute name, or a callback function.
     *
     * @param {Element} element
     * @param {String|Function} query
     * @returns {String}
     */
    getValue: function(element, query) {
        if (!query) {
            return null;
        }

        if (typeOf(query) === 'function') {
            return query.call(this, element);
        }

        return element.get(query);
    },

    /**
     * Hide the element and set all relevant values to null.
     *
     * @param {Function} [callback]
     */
    hide: function(callback) {
        if (this.isVisible()) {
            this.element.conceal();

            if (typeOf(callback) === 'function') {
                callback();
            }

            this.fireEvent('hide');
        }
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
     * Request data from a URL and handle all the possible scenarios.
     *
     * @param {String} url
     * @returns {Titon.Component}
     */
    requestData: function(url) {
        if (this.cache[url]) {
            return this;
        }

        new Request({
            url: url,
            method: 'get',
            evalScripts: true,

            onSuccess: function(response) {
                this.cache[url] = response;

                // Does not apply to all components
                if (this.options.showLoading) {
                    this.element.removeClass('is-loading');
                }

                this._position(response);
            }.bind(this),

            onRequest: function() {
                this.cache[url] = true;

                // Does not apply to all components
                if (this.options.showLoading) {
                    this.element.addClass('is-loading');

                    this._position(this._loadingTemplate());
                }
            }.bind(this),

            onFailure: function() {
                delete this.cache[url];

                this.element
                    .removeClass('is-loading')
                    .addClass('has-failed');

                this._position(this._errorTemplate());
            }.bind(this)
        }).get();

        return this;
    },

    /**
     * Destroy the current template and reset.
     *
     * @param {bool} [dispose]
     * @returns {Titon.Component}
     */
    reset: function(dispose) {
        if (this.element && dispose) {
            this.element.dispose();
            this.element = null;
        }

        this.cache = {};
        this.node = null;

        return this;
    },

    /**
     * Set the element to use. Apply optional class names if available.
     *
     * @param {String|Element} element
     * @returns {Titon.Component}
     */
    setElement: function(element) {
        if (typeOf(element) === 'string') {
            element = document.getElement(element); // Uses #id format
        }

        this.element = element;
        this.options.parseTemplate = false;

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
     * @returns {Titon.Component}
     */
    setNodes: function(nodes) {
        this.nodes = nodes;

        return this;
    },

    /**
     * Show the element and store the node.
     *
     * @param {Element} node
     */
    show: function(node) {
        this.node = node;
        this.element.reveal();
        this.fireEvent('show');
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
            text: this.options.errorMessage || Locale.get('Titon.error')
        });
    }.protect(),

    /**
     * Event callback to hide an element.
     *
     * @private
     * @param {DOMEvent} e
     */
    _hide: function(e) {
        if (typeOf(e) === 'domevent') {
            e.stop();
        }

        this.hide();
    },

    /**
     * Return a DOM element for loading messages.
     *
     * @private
     * @returns {Element}
     */
    _loadingTemplate: function() {
        return new Element('div.' + this.className().toLowerCase() + '-loading', {
            text: this.options.loadingMessage || Locale.get('Titon.loading')
        });
    }.protect(),

    /**
     * Set the content and position the element.
     *
     * @private
     * @param {String} content
     */
    _position: function(content) {
        this.element.set('html', content);
    },

    /**
     * Event callback to show an element via node hover or click.
     *
     * @private
     * @param {DOMEvent} e
     * @param {Element} node
     */
    _show: function(e, node) {
        if (typeOf(e) === 'domevent') {
            e.stop();
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
    },

    /**
     * Toggle activation events on and off.
     * Will either apply events via delegation or directly to an element.
     *
     * @private
     * @param {bool} on
     * @returns {Titon.Component}
     */
    _toggleEvents: function(on) {
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

        if (!context) {
            return this;
        } else if (on) {
            context.addEvent(event, this._show);
        } else {
            context.removeEvent(event, this._show);
        }

        return this;
    }.protect()

});

})();