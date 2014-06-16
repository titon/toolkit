define([
    '../base',
    '../extensions/aria',
    '../extensions/conceal',
    '../extensions/reveal',
    '../extensions/toolkit'
], function(Toolkit) {

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
            template = $(options.template);

            if (template.length) {
                template.conceal().appendTo('body');
            }
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
        Toolkit.Base.prototype.destroy.call(this);

        // Remove element only if it was created
        if (this.created) {
            this.element.remove();
        }

        // Remove instances last or else the previous commands will fail
        var key = this.keyName;

        if (this.nodes) {
            this.nodes.removeData('toolkit.' + key);

            // Remove the cached instance also
            delete Toolkit.cache[key + '.' + this.nodes.selector];

        } else if (this.element) {
            this.element.removeData('toolkit.' + key);
        }
    },

    /**
     * Hide the primary element.
     */
    hide: function() {
        this.element.conceal();

        this.fireEvent('hide');
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
     * @param {Function} before
     * @param {Function} done
     * @param {Function} fail
     * @returns {jqXHR}
     */
    requestData: function(options, before, done, fail) {
        var url = options.url || options;

        // Set default options
        var ajax = $.extend({}, {
            url: url,
            type: 'GET',
            context: this,
            beforeSend: before || function() {
                this.cache[url] = true;
                this.element
                    .addClass('is-loading')
                    .aria('busy', true);
            }
        }, options);

        // Inherit base options
        if ($.type(this.options.ajax) === 'object') {
            ajax = $.extend({}, this.options.ajax, ajax);
        }

        var cache = (ajax.type.toUpperCase() === 'GET' && this.options.cache);

        return $.ajax(ajax)
            .done(done || function(response, status, xhr) {
                this.element
                    .removeClass('is-loading')
                    .aria('busy', false);

                // HTML
                if (xhr.getResponseHeader('Content-Type').indexOf('text/html') >= 0) {
                    if (cache) {
                        this.cache[url] = response;
                    } else {
                        delete this.cache[url];
                    }

                    this.position(response);

                // JSON, others
                } else {
                    delete this.cache[url];

                    this.process(response);
                }
            })
            .fail(fail || function() {
                delete this.cache[url];

                this.element
                    .removeClass('is-loading')
                    .addClass('has-failed')
                    .aria('busy', false);

                this.position(Toolkit.messages.error);
            });
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

        this.element.reveal();

        this.fireEvent('show');
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

        if (this.element.is(':shown')) {

            // Touch devices should pass through on second click
            if (Toolkit.isTouch) {
                if (!isNode || this.node.prop('tagName').toLowerCase() !== 'a') {
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
            if (isNode) {
                return;
            }

        } else {
            e.preventDefault();
        }

        this.show(node);
    }

}, {
    cache: true,
    context: null,
    className: '',
    template: '',
    templateFrom: ''
});

return Toolkit;
});