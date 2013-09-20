/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function(window) {
    'use strict';

window.Titon = {

    /** Current version */
    version: '%version%',

    /** Build date hash */
    build: '%build%',

    /** Localization messages */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /**
     * Create the element from the template.
     *
     * @param {Object} options
     * @returns {Element}
     */
    createElement: function(options) {
        var template;

        if (!options.parseTemplate) {
            return [];
        }

        // Use another element as the template
        if (options.templateFrom) {
            template = $(options.templateFrom);
        }

        // From a string
        if (!template.length && options.template) {
            template = $(options.template);

            if (template.length) {
                template.conceal().appendTo('body');
            }
        }

        // Store it in the DOM
        if (!template.length) {
            throw new Error('Failed to create template element');
        }

        return Titon.setElement(template, options);
    },

    /**
     * Attempt to read a value from an element using the query.
     * Query can either be an attribute name, or a callback function.
     *
     * @param {jQuery} element
     * @param {String|Function} query
     * @returns {String}
     */
    getValue: function(element, query) {
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
     * Set the element to use. Apply optional class names if available.
     *
     * @param {String|Element} element
     * @param {Object} options
     * @returns {Element}
     */
    setElement: function(element, options) {
        element = $(element);
        options.parseTemplate = false;

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
     * @param {Object} [defaults]
     * @param {Object} [options]
     * @returns {Object}
     */
    setOptions: function(defaults, options) {
        return $.extend({}, defaults || {}, options || {});
    }

};

/**
 * Reveal the element by applying the show class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {Element}
 */
$.fn.reveal = function() {
    return this.removeClass('hide').addClass('show');
};

/**
 * Conceal the element by applying the hide class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {Element}
 */
$.fn.conceal = function() {
    return this.removeClass('show').addClass('hide');
};

/**
 * Used for CSS animations and transitions.
 *
 * @returns {bool}
 */
$.expr[':'].shown = function(obj) {
    return ($(obj).css('visibility') !== 'hidden');
};

})(window);
