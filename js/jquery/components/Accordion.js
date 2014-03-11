/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Accordion = Toolkit.Component.extend(function(element, options) {
        var headers, sections;

        this.component = 'Accordion';
        this.version = '1.1.0';
        this.element = element = $(element);
        this.options = options = this.setOptions(options, element);
        this.headers = headers = element.find(options.headerElement);
        this.sections = sections = element.find(options.sectionElement);
        this.index = 0;
        this.node = null;
        this.events = {};

        // Cache the index of each header
        headers.each(function(index) {
            $(this).data('index', index);
        });

        // Cache the height so we can use for sliding
        sections.each(function() {
            var section = $(this);
            section.data('height', section.height()).conceal();
        });

        // Initialize events
        this.events[options.mode + ' headers'] = 'onShow';

        this.enable();
        this.fireEvent('init');

        // Jump to the index on page load
        this.jump(options.defaultIndex);
    }, {

        /**
         * Go to the section indicated by the index number.
         * If the index is too large, jump to the beginning.
         * If the index is too small, jump to the end.
         *
         * @param {Number} index
         */
        jump: function(index) {
            index = Toolkit.bound(index, this.headers.length);

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
                section = node.next(), // section
                index = node.data('index'),
                height = parseInt(section.data('height'), 10),
                isNode = (this.node && this.node.is(node)),
                isPrefix = Toolkit.options.isPrefix;

            // Allow simultaneous open and closed sections
            // Or allow the same section to collapse
            if (options.mode === 'click' && (options.multiple || options.collapsible && isNode)) {
                if (section.is(':shown') && this.node) {
                    section.css('max-height', 0).conceal();
                    parent.removeClass(isPrefix + 'active');

                } else {
                    section.css('max-height', height).reveal();
                    parent.addClass(isPrefix + 'active');
                }

            // Only one open at a time
            } else {

                // Exit early so we don't mess with animations
                if (isNode) {
                    return;
                }

                this.sections.css('max-height', 0).conceal();
                section.css('max-height', height).reveal();

                this.element.children('li').removeClass(isPrefix + 'active');
                parent.addClass(isPrefix + 'active');
            }

            this.index = index;
            this.node = node;

            this.fireEvent('show', [section, node, index]);
        },

        /**
         * Event handler for header element click or hover.
         *
         * @private
         * @param {jQuery.Event} e
         */
        onShow: function(e) {
            e.preventDefault();

            this.show(e.currentTarget);
        }

    }, {
        mode: 'click',
        defaultIndex: 0,
        multiple: false,
        collapsible: false,
        headerElement: '.accordion-header',
        sectionElement: '.accordion-section'
    });

    /**
     * Defines a component that can be instantiated through accordion().
     */
    Toolkit.createComponent('accordion', function(options) {
        return new Toolkit.Accordion(this, options);
    });

})(jQuery);