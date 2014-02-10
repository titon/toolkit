/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Accordion = Toolkit.Component.extend(function(element, options) {
        var header, headers, sections;

        this.component = 'Accordion';
        this.version = '1.0.0';

        // Set options and element
        this.options = options = this.setOptions(options);
        this.element = element = this.setElement(element);

        // List of headers and sections
        this.headers = headers = this.element.find(options.headerElement);
        this.sections = sections = this.element.find(options.contentElement);

        // The current and previous shown indices
        this.previousIndex = 0;
        this.currentIndex = 0;

        // Currently active header
        this.node = null;

        // Reset the state of every row
        element.children('li').removeClass(Toolkit.options.isPrefix + 'active');

        // Store the index
        headers.each(function(index) {
            $(this).data('index', index);
        });

        // Cache the height so we can use for sliding
        sections.each(function() {
            var section = $(this);
            section.data('height', section.height()).conceal();
        });

        // Set events
        headers.on((options.mode === 'click' ? 'click' : 'mouseover'), this.__show.bind(this));

        this.fireEvent('init');

        // Fall back to first row if the default doesn't exist
        header = headers[options.defaultIndex] ? headers.item(options.defaultIndex) : headers.item(0);

        this.show(header);
    }, {

        /**
         * Go to the section indicated by the index number.
         * If the index is too large, jump to the beginning.
         * If the index is too small, jump to the end.
         *
         * @param {Number} index
         */
        jump: function(index) {
            if (index >= this.headers.length) {
                index = 0;
            } else if (index < 0) {
                index = this.headers.length - 1;
            }

            this.fireEvent('jump', index);
            this.show(this.headers[index]);
        },

        /**
         * Toggle the section display of a row via the header click/hover event.
         * Take into account the multiple and collapsible options.
         *
         * @param {jQuery} node
         */
        show: function(node) {
            node = $(node);

            var options = this.options,
                parent = node.parent(), // li
                section = node.next(options.contentElement), // section
                index = node.data('index'),
                height = parseInt(section.data('height'), 10),
                isNode = (this.node && this.node.is(node));

            // Allow simultaneous open and closed sections
            // Or allow the same section to collapse
            if (options.mode === 'click' && (options.multiple || options.collapsible && isNode)) {
                if (section.is(':shown') && this.node) {
                    section.css('max-height', 0).conceal();
                    parent.removeClass(Toolkit.options.isPrefix + 'active');

                } else {
                    section.css('max-height', height).reveal();
                    parent.addClass(Toolkit.options.isPrefix + 'active');
                }

            // Only one open at a time
            } else {

                // Exit early so we don't mess with animations
                if (isNode) {
                    return;
                }

                this.sections.css('max-height', 0).conceal();
                section.css('max-height', height).reveal();

                this.element.children('li').removeClass(Toolkit.options.isPrefix + 'active');
                parent.addClass(Toolkit.options.isPrefix + 'active');
            }

            this.previousIndex = this.currentIndex;
            this.currentIndex = index;
            this.node = node;

            this.fireEvent('show', section);
        },

        /**
         * Event handler for header element click or hover.
         *
         * @private
         * @param {jQuery.Event} e
         */
        __show: function(e) {
            e.preventDefault();

            this.show(e.currentTarget);
        }

    }, {
        mode: 'click',
        defaultIndex: 0,
        multiple: false,
        collapsible: false,
        headerElement: '.accordion-head',
        contentElement: '.accordion-handle'
    });

    /**
     * Defines a component that can be instantiated through accordion().
     */
    Toolkit.createComponent('accordion', function(options) {
        return new Toolkit.Accordion(this, options);
    });

})(jQuery);