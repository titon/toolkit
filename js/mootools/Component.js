/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Component = new Class({
    Implements: [Events, Options],
    Binds: ['onShow', 'onHide', 'position'],

    /** Unique ID for this instance */
    uid: 0,

    /** Cached data */
    cache: {},

    /** Events to bind */
    events: {},

    /** Is class functionality enabled? */
    enabled: false,

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

        // Templates
        template: '',
        templateFrom: ''
    },

    /**
     * Set options.
     *
     * @param {Object} [options]
     */
    initialize: function(options) {
        this.setOptions(options || {});

        // Generate UID and class name
        var className = this.className();

        Toolkit[className].count = Toolkit[className].count || 0;

        this.uid = Toolkit[className].count += 1;
        this.cssClass = className.hyphenate().slice(1);
    },

    /**
     * Loop through the events object map and attach events to the specific selector in the correct context.
     * Take into account window, document, and delegation.
     *
     * @param {String} type
     * @returns {Toolkit.Component}
     */
    bindEvents: function(type) {
        var self = this,
            event,
            keys,
            context,
            selector,
            funcs,
            win = window,
            doc = document,
            method = (type === 'on') ? 'addEvent' : 'removeEvent';

        // event window = func          Bind window event
        // event document = func        Bind document event
        // ready document = func        Bind DOM ready event
        // event property = func        Bind event to collection that matches class property
        // event .class = func          Bind delegated events to class on document
        // event context .class = func  Bind delegated events to class within context
        Object.each(this.events, function(value, key) {
            funcs = (typeOf(value) === 'array') ? value : [value];
            keys = key.split(' ');
            event = keys[0];
            context = keys[1];
            selector = keys[2] || null;

            // No context defined, so use the context in options
            // Also clickout events cannot be delegated
            if ((context.charAt(0) === '.' || context.charAt(0) === '#') && event !== 'clickout') {
                selector = context;
                context = self.options.context;
            }

            // The context is a property on the object
            if (typeof self[context] !== 'undefined') {
                context = self[context];
            }

            // Exit if no context or empty context
            if (typeOf(context) === 'array' && !context.length) {
                return;
            }

            funcs.each(function(func) {
                if (typeOf(func) !== 'function') {
                    func = self[func].bind(self);
                }

                // On window
                if (context === 'window') {
                    win[method](event, func);

                // On document
                } else if (context === 'document') {
                    if (event === 'ready') {
                        win[method]('domready', func);
                    } else {
                        doc[method](event, func);
                    }

                // Clickout
                } else if (event === 'clickout') {
                    $$(context)[method](event, func);

                // Delegated
                } else if (selector) {
                    (context || doc)[method](event + ':relay(' + selector + ')', func);

                // On element
                } else {
                    context[method](event, func);
                }
            });
        });

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

            // Add a class name
            if (options.className) {
                template.addClass(options.className);
            }

            // Enable animations
            if (options.animation) {
                template.addClass(options.animation);
            }

            this.element = template;
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
        this.bindEvents('off');

        return this;
    },

    /**
     * Enable component.
     *
     * @returns {Toolkit.Component}
     */
    enable: function() {
        this.enabled = true;
        this.bindEvents('on');

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
     * Generate a unique CSS class name for the component and its arguments.
     *
     * @returns {String}
     */
    id: function() {
        var list = Array.slice(arguments);
            list.unshift('toolkit', this.cssClass, this.uid);

        return list.join('-');
    },

    /**
     * Inherit options from the target elements data attributes.
     *
     * @param {Object} options
     * @param {Element} element
     * @returns {Object}
     */
    inheritOptions: function(options, element) {
        var key, value, obj = {};

        for (key in options) {
            if (key === 'context' || key === 'template') {
                continue;
            }

            value = element.get('data-' + this.cssClass + '-' + key.toLowerCase());

            if (typeOf(value) !== 'null') {
                obj[key] = Toolkit.autobox(value);
            }
        }

        return Object.merge({}, options, obj);
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
     * Handle and process non-HTML responses.
     *
     * @param {*} content
     * @returns {Toolkit.Component}
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

        this.fireEvent('process', content);

        return this;
    },

    /**
     * Read a class option from a data attribute.
     * If no attribute exists, return the option value.
     *
     * @param {Element} element
     * @param {String} key
     * @returns {*}
     */
    readOption: function(element, key) {
        var value = element.get('data-' + this.cssClass + '-' + key.toLowerCase());

        if (typeOf(value) === 'null') {
            value = this.options[key];
        } else {
            value = Toolkit.autobox(value);
        }

        return value;
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
     * @param {Object} options
     * @param {Function} before
     * @param {Function} done
     * @param {Function} fail
     * @returns {Toolkit.Component}
     */
    requestData: function(options, before, done, fail) {
        var url = options.url || options;

        // Set default options
        var ajax = Object.merge({
            url: url,
            method: 'GET',
            evalScripts: true,
            onRequest: before || function() {
                this.cache[url] = true;
                this.element.addClass('is-loading');
            }.bind(this)
        }, options);

        // Inherit base options
        if (typeOf(this.options.ajax) === 'object') {
            ajax = Object.merge({}, this.options.ajax, ajax);
        }

        // Set callbacks
        var self = this,
            cache = (ajax.method.toUpperCase() === 'GET');

        ajax.onSuccess = done || function(response) {
            var contentType = this.xhr.getResponseHeader('Content-Type');

            // Does not apply to all components
            self.element.removeClass('is-loading');

            // HTML
            if (contentType.indexOf('text/html') >= 0) {
                if (cache) {
                    self.cache[url] = response;
                } else {
                    delete self.cache[url];
                }

                self.position(response);

                // JSON, others
            } else {
                delete self.cache[url];

                // MooTools doesn't auto parse
                if (contentType === 'application/json') {
                    response = JSON.parse(response);
                }

                self.process(response);
            }
        };

        ajax.onFailure = fail || function() {
            delete this.cache[url];

            this.element
                .removeClass('is-loading')
                .addClass('has-failed');

            this.position(Toolkit.messages.error);
        }.bind(this);

        new Request(ajax).send();

        return this;
    },

    /**
     * Override options when necessary.
     * Code taken from Options class.
     *
     * @param {Object} options
     * @param {Element} [inheritFrom]
     * @returns {Toolkit.Component}
     */
    setOptions: function(options, inheritFrom) {
        options = Object.merge({}, this.options, options || {});

        if (inheritFrom) {
            options = this.inheritOptions(options, inheritFrom);
        }

        // Convert hover to mouseenter
        if (options.mode && options.mode === 'hover') {

            // Reset for touch devices
            if (Toolkit.isTouch) {
                options.mode = 'click';
            } else {
                options.mode = 'mouseenter';
            }
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
     * Event handler to hide an element.
     *
     * @private
     * @param {DOMEvent} e
     */
    onHide: function(e) {
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
    onShow: function(e, node) {
        if (!this.enabled) {
            return;
        }

        node = node || e.target;

        if (this.isVisible()) {

            // Touch devices should pass through on second click
            if (Toolkit.isTouch) {
                if (node !== this.node || this.node.get('tag') !== 'a') {
                    e.preventDefault();
                }

            // Non-touch devices
            } else {
                e.preventDefault();
            }

            // Second click should close it
            if (this.options.mode === 'click') {
                this.hide();
            }

            // Exit if the same node so it doesn't re-open
            if (node === this.node) {
                return;
            }

        } else if (typeOf(e) === 'domevent') {
            e.preventDefault();
        }

        this.show(node);
    }

});

})();