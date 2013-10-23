/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Component = function() {

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
     * @returns {Titon.Component}
     */
    this.disable = function() {
        this.enabled = false;

        return this;
    };

    /**
     * Enable component.
     *
     * @returns {Titon.Component}
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
     * @returns {Titon.Component}
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
        return $.extend({}, defaults || {}, options || {});
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
            .text(Titon.messages.error);
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
            .text(Titon.messages.loading);
    };

};

})(jQuery);