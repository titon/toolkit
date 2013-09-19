/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Accordion = new Class({
    Extends: Titon.Component,

    /** List of DOM headers */
    headers: [],

    /** List of DOM sections */
    sections: [],

    /** Default options */
    options: {
        mode: 'click',
        defaultIndex: 0,
        multiple: false,
        collapsible: false,
        headerElement: '.accordion-head',
        contentElement: '.accordion-inner'
    },

    /**
     * Set the element and attach events.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.setElement(element);

        options = this.options;

        // Fetch all the sections and headers
        var sections = this.element.getElements(options.contentElement),
            headers = this.element.getElements(options.headerElement),
            header = headers[0];

        this.headers = headers;
        this.sections = sections;

        // Fall back to first row if the default doesn't exist
        if (headers[options.defaultIndex]) {
            header = headers[options.defaultIndex];
        }

        // Reset the state of every row
        this.element.getElements('> li').removeClass('is-active');

        // Cache the height so we can use for sliding
        sections.each(function(section) {
            section.set('data-height', section.getHeight()).conceal();
        });

        this.show(header);

        // Set events
        this.disable().enable();

        this.fireEvent('init');
    },

    /**
     * Toggle the section display of a row via the header click/hover event.
     * Take into account the multiple and collapsible options.
     *
     * @param {Element} node
     * @returns {Titon.Accordion}
     */
    show: function(node) {
        var options = this.options,
            parent = node.getParent(), // li
            section = node.getNext(options.contentElement); // section;

        // If we don't double the height the animation won't occur
        var height = section.get('data-height') * 2;

        // Allow simultaneous open and closed sections
        // Or allow the same section to collapse
        if (options.multiple || (options.collapsible && this.node === node)) {
            if (section.isShown()) {
                section.setStyle('max-height', 0).conceal();
                parent.removeClass('is-active');

            } else {
                section.setStyle('max-height', height).reveal();
                parent.addClass('is-active');
            }

        // Only one open at a time
        } else {

            // Exit early so we don't mess with animations
            if (this.node === node) {
                return this;
            }

            this.sections.setStyle('max-height', 0).conceal();
            section.setStyle('max-height', height).reveal();

            this.element.getElements('> li').removeClass('is-active');
            parent.addClass('is-active');
        }

        this.node = node;
        this.fireEvent('show', section);

        return this;
    },

    /**
     * Event callback for header element click or hover.
     *
     * @private
     * @param {DOMEvent} e
     */
    _show: function(e) {
        var target = e.target,
            headerClass = this.options.headerElement.substr(1);

        // Fetch the header in case a child is clicked
        while (target && !target.hasClass(headerClass)) {
            target = target.getParent();
        }

        if (!target) {
            return;
        }

        this.show(target);
    },

    /**
     * Toggle activation events on and off.
     *
     * @private
     * @param {bool} on
     * @returns {Titon.Accordion}
     */
    _toggleEvents: function(on) {
        if (!this.element) {
            return this;
        }

        var event = (this.options.mode === 'click') ? 'click' : 'mouseover';

        if (on) {
            this.headers.addEvent(event, this._show);
        } else {
            this.headers.removeEvent(event, this._show);
        }

        return this;
    }.protect()

});

/**
 * Enable an accordion on an element by calling accordion().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('accordion-id').accordion({
 *         multiple: false
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Accordion}
 */
Element.implement('accordion', function(options) {
    if (this.$accordion) {
        return this.$accordion;
    }

    this.$accordion = new Titon.Accordion(this, options);

    return this.$accordion;
});

})();