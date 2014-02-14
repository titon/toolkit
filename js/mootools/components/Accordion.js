/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Accordion = new Class({
    Extends: Toolkit.Component,

    /** List of DOM headers */
    headers: [],

    /** List of DOM sections */
    sections: [],

    /** The current and previous shown indices */
    previousIndex: 0,
    currentIndex: 0,

    /** Default options */
    options: {
        mode: 'click',
        defaultIndex: 0,
        multiple: false,
        collapsible: false,
        headerElement: '.accordion-header',
        sectionElement: '.accordion-section',

        // Events
        onJump: null
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.setElement(element);

        options = this.options;

        // Fetch all the sections and headers
        var sections = this.element.getElements(options.sectionElement),
            headers = this.element.getElements(options.headerElement),
            header = headers[0];

        this.headers = headers;
        this.sections = sections;

        // Fall back to first row if the default doesn't exist
        if (headers[options.defaultIndex]) {
            header = headers[options.defaultIndex];
        }

        // Reset the state of every row
        this.element.getChildren('li').removeClass(Toolkit.options.isPrefix + 'active');

        // Store the index
        headers.each(function(header, index) {
            header.set('data-index', index);
        });

        // Cache the height so we can use for sliding
        sections.each(function(section) {
            section.set('data-height', section.getHeight()).conceal();
        });

        // Set events
        this.bindEvents();
        this.fireEvent('init');

        this.show(header);
    },

    /**
     * Attach events to listen for header clicks.
     *
     * @returns {Toolkit.Accordion}
     */
    bindEvents: function() {
        if (!this.element) {
            return this;
        }

        this.headers.addEvent((this.options.mode === 'click' ? 'click' : 'mouseover'), this.__show);

        return this;
    },

    /**
     * Go to the section indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     * @returns {Toolkit.Accordion}
     */
    jump: function(index) {
        if (index >= this.headers.length) {
            index = 0;
        } else if (index < 0) {
            index = this.headers.length - 1;
        }

        this.fireEvent('jump', index);

        return this.show(this.headers[index]);
    },

    /**
     * Toggle the section display of a row via the header click/hover event.
     * Take into account the multiple and collapsible options.
     *
     * @param {Element} node
     * @returns {Toolkit.Accordion}
     */
    show: function(node) {
        var options = this.options,
            parent = node.getParent(), // li
            section = node.getNext(), // section
            index = node.get('data-index'),
            height = section.get('data-height').toInt();

        // Allow simultaneous open and closed sections
        // Or allow the same section to collapse
        if (options.mode === 'click' && (options.multiple || (options.collapsible && this.node === node))) {
            if (section.isShown() && this.node) {
                section.setStyle('max-height', 0).conceal();
                parent.removeClass(Toolkit.options.isPrefix + 'active');

            } else {
                section.setStyle('max-height', height).reveal();
                parent.addClass(Toolkit.options.isPrefix + 'active');
            }

        // Only one open at a time
        } else {

            // Exit early so we don't mess with animations
            if (this.node === node) {
                return this;
            }

            this.sections.setStyle('max-height', 0).conceal();
            section.setStyle('max-height', height).reveal();

            this.element.getChildren('li').removeClass(Toolkit.options.isPrefix + 'active');
            parent.addClass(Toolkit.options.isPrefix + 'active');
        }

        this.previousIndex = this.currentIndex;
        this.currentIndex = index;
        this.node = node;

        this.fireEvent('show', section);

        return this;
    },

    /**
     * Event handler for header element click or hover.
     *
     * @private
     * @param {DOMEvent} e
     */
    __show: function(e) {
        e.preventDefault();

        if (!this.enabled) {
            return;
        }

        var target = e.target,
            headers = this.headers;

        // Fetch the header in case a child is clicked
        while (!headers.contains(target)) {
            target = target.getParent();
        }

        if (!target) {
            return;
        }

        this.show(target);
    }

});

    /**
     * Defines a component that can be instantiated through accordion().
     */
    Toolkit.createComponent('accordion', function(options) {
        return new Toolkit.Accordion(this, options);
    });

})();