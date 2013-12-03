/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Toolkit.Component = function() {

    /**
     * Create the element from the template.
     *
     * @param {Object} options
     * @returns {jQuery}
     */
    this.createElement = function(options) {
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
    this.disable = function() {
        this.enabled = false;

        return this;
    };

    /**
     * Enable component.
     *
     * @returns {Toolkit.Component}
     */
    this.enable = function() {
        this.enabled = true;

        return this;
    };

    /**
     * Trigger an event if it exists.
     *
     * @param {String} event
     * @param {Array} args
     * @returns {Toolkit.Component}
     */
    this.fireEvent = function(event, args) {
        if (args && !$.isArray(args)) {
            args = [args];
        }

        if (event.substr(0, 2) !== 'on') {
            event = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
        }

        if (this.options[event]) {
            this.options[event].apply(this, args || []);
        }

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
    this.readValue = function(element, query) {
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
     * @param {String} type
     * @param {String} url
     * @param {Function} before
     * @param {Function} done
     * @param {Function} fail
     * @returns {Toolkit.Component}
     */
    this.requestData = function(type, url, before, done, fail) {
        var ajax = {
            url: url,
            type: 'GET',
            dataType: 'html',
            context: this,
            beforeSend: before || function() {
                this.cache[url] = true;

                // Does not apply to all components
                if (this.options.showLoading) {
                    this.element.addClass('is-loading');

                    this.position(this._loadingTemplate(type));
                }
            }
        };

        // Inherit custom options
        if ($.type(this.options.ajax) === 'object') {
            ajax = $.merge(this.options.ajax, ajax);
        }

        $.ajax(ajax)
            .done(done || function(response) {
                this.cache[url] = response;

                // Does not apply to all components
                if (this.options.showLoading) {
                    this.element.removeClass('is-loading');
                }

                this.position(response);
            })
            .fail(fail || function() {
                delete this.cache[url];

                this.element
                    .removeClass('is-loading')
                    .addClass('has-failed');

                this.position(this._errorTemplate(type));
            });

        return this;
    };

    /**
     * Set the element to use. Apply optional class names if available.
     *
     * @param {String|Element} element
     * @param {Object} options
     * @returns {jQuery}
     */
    this.setElement = function(element, options) {
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
    this.setOptions = function(defaults, options) {
        var opts = $.extend({}, defaults || {}, options || {});

        // Reset for touch devices
        if (Toolkit.isTouch && opts.mode === 'hover') {
            opts.mode = 'click';
        }

        return opts;
    };

    /**
     * Return a DOM element for error messages.
     *
     * @param {String} component
     * @returns {jQuery}
     */
    this._errorTemplate = function(component) {
        return $('<div/>')
            .addClass(component + '-error')
            .text(Toolkit.messages.error);
    };

    /**
     * Return a DOM element for loading messages.
     *
     * @param {String} component
     * @returns {jQuery}
     */
    this._loadingTemplate = function(component) {
        return $('<div/>')
            .addClass(component + '-loading')
            .text(Toolkit.messages.loading);
    };

};

})(jQuery);