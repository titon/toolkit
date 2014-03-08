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

            return this.setElement(template);
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
         * Disable
         */
        disable: function() {
            this.enabled = false;
            this.bindEvents('off');
        },

        /**
         * Enable
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
            var onType = 'on' + type.charAt(0).toUpperCase() + type.slice(1);

            if (this.options[onType]) {
                this.options[onType].apply(this, args || []);
            }

            // Trigger per element
            if (this.element && this.element.length) {
                var name = this.component;
                    name = name.split('.').map(function(value) {
                        return value.charAt(0).toLowerCase() + value.slice(1);
                    }).join('.');

                var event = jQuery.Event(type + '.toolkit.' + name);
                    event.context = this;

                this.element.trigger(event, args || []);
            }
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
                    this.element.addClass(Toolkit.options.isPrefix + 'loading');
                }
            }, options);

            // Inherit base options
            if ($.type(this.options.ajax) === 'object') {
                ajax = $.extend({}, this.options.ajax, ajax);
            }

            var cache = (ajax.type.toUpperCase() === 'GET');

            return $.ajax(ajax)
                .done(done || function(response, status, xhr) {
                    this.element.removeClass(Toolkit.options.isPrefix + 'loading');

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
                        .removeClass(Toolkit.options.isPrefix + 'loading')
                        .addClass(Toolkit.options.hasPrefix + 'failed');

                    this.position(this._errorTemplate());
                });
        },

        /**
         * Set the element to use. Apply optional class names if available.
         *
         * @param {String|Element|jQuery} element
         * @returns {jQuery}
         */
        setElement: function(element) {
            var options = this.options;
                options.template = false;

            element = $(element);

            // Add a class name
            if (options.className) {
                element.addClass(options.className);
            }

            // Enable animations
            if (options.animation) {
                element.addClass(options.animation);
            }

            return element;
        },

        /**
         * Set the options by merging with defaults.
         *
         * @param {Object} [options]
         * @returns {Object}
         */
        setOptions: function(options) {
            var defaults = Toolkit,
                path = this.component;

            // Drill into object to find defaults
            if (path.indexOf('.') >= 0) {
                path = path.split('.');

                for (var i = 0; i < path.length; i++) {
                    defaults = defaults[path[i]];
                }
            } else {
                defaults = defaults[path];
            }

            var opts = $.extend(true, {}, defaults.options, options || {});

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
         * Return a DOM element for error messages.
         *
         * @returns {jQuery}
         */
        _errorTemplate: function() {
            return $('<div/>')
                .addClass(Toolkit.options.vendor + $.hyphenate(this.component).slice(1) + '-error')
                .text(Toolkit.messages.error);
        },

        /**
         * Return a DOM element for loading messages.
         *
         * @returns {jQuery}
         */
        _loadingTemplate: function() {
            return $('<div/>')
                .addClass(Toolkit.options.vendor + $.hyphenate(this.component).slice(1) + '-loading')
                .text(Toolkit.messages.loading);
        }

    }, {
        context: null,
        className: '',
        template: '',
        templateFrom: ''
    });

})(jQuery);