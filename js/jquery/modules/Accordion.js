/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Accordion = Titon.Component.create(function(element, options) {

    /** Custom options */
    this.options = this.setOptions($.fn.accordion.options, options);

    /** Primary DOM wrapper */
    this.element = this.setElement(element, this.options);

    /** List of DOM headers */
    this.headers = [];

    /** List of DOM sections */
    this.sections = [];

    /** Currently active header */
    this.node = null;

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        var options = this.options;

        // Fetch all the sections and headers
        var sections = this.element.find(options.contentElement),
            headers = this.element.find(options.headerElement),
            header = headers[0];

        this.headers = headers;
        this.sections = sections;

        // Fall back to first row if the default doesn't exist
        if (headers[options.defaultIndex]) {
            header = headers[options.defaultIndex];
        }

        // Reset the state of every row
        this.element.children('li').removeClass('is-active');

        // Cache the height so we can use for sliding
        sections.each(function() {
            var section = $(this);
            section.data('height', section.height()).conceal();
        });

        this.show(header);

        // Set events
        headers.on((this.options.mode === 'click' ? 'click' : 'mouseover'), this.__show.bind(this));
    };

    /**
     * Toggle the section display of a row via the header click/hover event.
     * Take into account the multiple and collapsible options.
     *
     * @param {jQuery} node
     * @returns {Titon.Accordion}
     */
    this.show = function(node) {
        node = $(node);

        var options = this.options,
            parent = node.parent(), // li
            section = node.next(options.contentElement); // section

        // If we don't double the height the animation won't occur
        var height = section.data('height') * 2;

        // Allow simultaneous open and closed sections
        // Or allow the same section to collapse
        if (options.multiple || (options.collapsible && this.node === node)) {
            if (section.is(':shown')) {
                section.css('max-height', 0).conceal();
                parent.removeClass('is-active');

            } else {
                section.css('max-height', height).reveal();
                parent.addClass('is-active');
            }

        // Only one open at a time
        } else {

            // Exit early so we don't mess with animations
            if (this.node === node) {
                return this;
            }

            this.sections.css('max-height', 0).conceal();
            section.css('max-height', height).reveal();

            this.element.children('li').removeClass('is-active');
            parent.addClass('is-active');
        }

        this.node = node;

        return this;
    };

    /**
     * Event handler for header element click or hover.
     *
     * @private
     * @param {Event} e
     */
    this.__show = function(e) {
        e.preventDefault();

        this.show(e.currentTarget);
    };

    // Initialize the class only if the element exists
    if (this.element.length) {
        this.initialize();
    }
});

/**
 * Enable an accordion on an element by calling accordion().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('#accordion-id').accordion({
 *         multiple: false
 *     });
 *
 * @param {Object} [options]
 * @returns {jQuery}
 */
$.fn.accordion = function(options) {
    return this.each(function() {
        if (!this.$accordion) {
            this.$accordion = new Titon.Accordion(this, options);
        }
    });
};

$.fn.accordion.options = {
    className: '',
    mode: 'click',
    defaultIndex: 0,
    multiple: false,
    collapsible: false,
    headerElement: '.accordion-head',
    contentElement: '.accordion-inner',
    template: false
};

})(jQuery);