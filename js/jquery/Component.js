/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Component = function() {};

    var Component = Toolkit.Component.prototype;

    // Shared properties
    Component.component = 'Component';
    Component.version = '0.0.0';
    Component.enabled = true;

    /**
     * Create the element from the template.
     *
     * @param {Object} options
     * @returns {jQuery}
     */
    Component.createElement = function(options) {
        var template;

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

        return this.setElement(template, options);
    };

    /**
     * Disable component.
     *
     * @returns {Toolkit.Component}
     */
    Component.disable = function() {
        this.enabled = false;

        return this;
    };

    /**
     * Enable component.
     *
     * @returns {Toolkit.Component}
     */
    Component.enable = function() {
        this.enabled = true;

        return this;
    };

    /**
     * Trigger an event if it exists.
     *
     * @param {String} type
     * @param {Array} args
     * @returns {Toolkit.Component}
     */
    Component.fireEvent = function(type, args) {
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
            var event = jQuery.Event(type + '.toolkit.' + this.component.toLowerCase());
                event.context = this;

            this.element.trigger(event, args || []);
        }

        return this;
    };

    /**
     * Handle and process non-HTML responses.
     *
     * @param {*} content
     * @returns {Toolkit.Component}
     */
    Component.process = function(content) {
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
    };

    /**
     * Attempt to read a value from an element using the query.
     * Query can either be an attribute name, or a callback function.
     *
     * @param {jQuery} element
     * @param {String|Function} query
     * @returns {String}
     */
    Component.readValue = function(element, query) {
        if (!query) {
            return null;
        }

        element = $(element);

        if ($.type(query) === 'function') {
            return query.call(this, element);
        }

        return element.attr(query);
    };

    /**
     * Request data from a URL and handle all the possible scenarios.
     *
     * @param {Object} options
     * @param {Function} before
     * @param {Function} done
     * @param {Function} fail
     * @returns {Toolkit.Component}
     */
    Component.requestData = function(options, before, done, fail) {
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

        $.ajax(ajax)
            .done(done || function(response, status, xhr) {
                this.element.removeClass(Toolkit.options.isPrefix + 'loading');

                // HTML
                if (xhr.getResponseHeader('Content-Type').indexOf('text/html') >= 0) {
                    if (cache) {
                        this.cache[url] = response;
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

        return this;
    };

    /**
     * Set the element to use. Apply optional class names if available.
     *
     * @param {String|Element|jQuery} element
     * @param {Object} options
     * @returns {jQuery}
     */
    Component.setElement = function(element, options) {
        element = $(element);
        options.template = false;

        // Add a class name
        if (options.className) {
            element.addClass(options.className);
        }

        // Enable animations
        if (options.animation) {
            element.addClass(options.animation);
        }

        return element;
    };

    /**
     * Set the options by merging with defaults.
     *
     * @param {Object} [defaults]
     * @param {Object} [options]
     * @returns {Object}
     */
    Component.setOptions = function(defaults, options) {
        var opts = $.extend(true, {}, defaults || {}, options || {});

        // Reset for touch devices
        if (Toolkit.isTouch && opts.mode === 'hover') {
            opts.mode = 'click';
        }

        return opts;
    };

    /**
     * Return a DOM element for error messages.
     *
     * @returns {jQuery}
     */
    Component._errorTemplate = function() {
        return $('<div/>')
            .addClass(Toolkit.options.vendor + this.component.toLowerCase + '-error')
            .text(Toolkit.messages.error);
    };

    /**
     * Return a DOM element for loading messages.
     *
     * @returns {jQuery}
     */
    Component._loadingTemplate = function() {
        return $('<div/>')
            .addClass(Toolkit.options.vendor + this.component.toLowerCase + '-loading')
            .text(Toolkit.messages.loading);
    };

})(jQuery);