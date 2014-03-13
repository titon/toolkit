/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Component = Toolkit.Class.extend(function() {}, {
        component: 'Component',
        version: '0.0.0',
        enabled: false,
        events: {},

        /**
         * Create the element from the template.
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

            // Store it in the DOM
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

            return template;
        },

        /**
         * Loop through the events object map and attach events to the specific selector in the correct context.
         * Take into account window, document, and delegation.
         *
         * @param {String} type
         */
        bindEvents: function(type) {
            var self = this,
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
            // event .class = func          Bind delegated events to class on document
            // event context .class = func  Bind delegated events to class within context
            $.each(this.events, function(key, value) {
                funcs = $.isArray(value) ? value : [value];
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
                if (self[context]) {
                    context = self[context];
                }

                $.each(funcs, function(i, func) {
                    if (!$.isFunction(func)) {
                        func = self[func].bind(self);
                    }

                    // On window
                    if (context === 'window') {
                        win[type](event, func);

                    // On document
                    } else if (context === 'document') {
                        if (event === 'ready') {
                            doc.ready(func);
                        } else {
                            doc[type](event, func);
                        }

                    // Delegated
                    } else if (selector) {
                        $(context || document)[type](event, selector, func);

                    // On element
                    } else {
                        $(context)[type](event, func);
                    }
                });
            });
        },

        /**
         * Disable the component.
         */
        disable: function() {
            this.enabled = false;
            this.bindEvents('off');
        },

        /**
         * Enable the component.
         */
        enable: function() {
            this.enabled = true;
            this.bindEvents('on');
        },

        /**
         * Trigger an event if it exists.
         *
         * @param {String} type
         * @param {Array} [args]
         */
        fireEvent: function(type, args) {
            if (!$.isArray(args)) {
                args = [args];
            }

            // Trigger event globally
            var onType = 'on' + type.charAt(0).toUpperCase() + type.slice(1),
                element = this.element;

            if (this.options[onType]) {
                this.options[onType].apply(this, args || []);
            }

            // Trigger per element
            if (element && element.length) {
                var name = this.component;
                    name = name.charAt(0).toLowerCase() + name.slice(1);

                var event = jQuery.Event(type + '.toolkit.' + name);
                    event.context = this;

                element.trigger(event, args || []);
            }
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

                value = element.data(this._class() + '-' + key.toLowerCase());

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

            this.fireEvent('process', content);
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
            var value = element.data(this._class() + '-' + key.toLowerCase());

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
            var url = options.url || options,
                isPrefix = Toolkit.options.isPrefix;

            // Set default options
            var ajax = $.extend({}, {
                url: url,
                type: 'GET',
                context: this,
                beforeSend: before || function() {
                    this.cache[url] = true;
                    this.element.addClass(isPrefix + 'loading');
                }
            }, options);

            // Inherit base options
            if ($.type(this.options.ajax) === 'object') {
                ajax = $.extend({}, this.options.ajax, ajax);
            }

            var cache = (ajax.type.toUpperCase() === 'GET');

            return $.ajax(ajax)
                .done(done || function(response, status, xhr) {
                    this.element.removeClass(isPrefix + 'loading');

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
                        .removeClass(isPrefix + 'loading')
                        .addClass(Toolkit.options.hasPrefix + 'failed');

                    this.position(this._errorTemplate());
                });
        },

        /**
         * Set the options by merging with defaults.
         *
         * @param {Object} [options]
         * @param {jQuery} [inheritFrom]
         * @returns {Object}
         */
        setOptions: function(options, inheritFrom) {
            var opts = $.extend(true, {}, Toolkit[this.component].options, options || {});

            // Inherit from element data attributes
            if (inheritFrom) {
                opts = this.inheritOptions(opts, inheritFrom);
            }

            // Convert hover to mouseenter
            if (opts.mode && opts.mode === 'hover') {

                // Reset for touch devices
                if (Toolkit.isTouch) {
                    opts.mode = 'click';
                } else {
                    opts.mode = 'mouseenter';
                }
            }

            return opts;
        },

        /**
         * Return the component name hyphenated for use in CSS classes.
         *
         * @private
         * @returns {string}
         */
        _class: function() {
            return $.hyphenate(this.component).slice(1);
        },

        /**
         * Return a DOM element for error messages.
         *
         * @private
         * @returns {jQuery}
         */
        _errorTemplate: function() {
            return $('<div/>')
                .addClass(Toolkit.options.vendor + this._class() + '-error')
                .text(Toolkit.messages.error);
        },

        /**
         * Return a DOM element for loading messages.
         *
         * @private
         * @returns {jQuery}
         */
        _loadingTemplate: function() {
            return $('<div/>')
                .addClass(Toolkit.options.vendor + this._class() + '-loading')
                .text(Toolkit.messages.loading);
        }

    }, {
        context: null,
        className: '',
        template: '',
        templateFrom: ''
    });

})(jQuery);