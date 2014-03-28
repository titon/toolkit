/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Accordion = Toolkit.Component.extend(function(element, options) {
    var self = this;

    this.component = 'Accordion';
    this.version = '1.4.0';
    this.element = element = $(element).attr('role', 'tablist');
    this.options = options = this.setOptions(options, element);

    // Find headers and cache the index of each header and set ARIA attributes
    this.headers = element.find('.accordion-header').each(function(index) {
        $(this)
            .data('index', index)
            .attr({
                role: 'tab',
                id: self.id('header', index)
            })
            .aria({
                controls: self.id('section', index),
                selected: false,
                expanded: false
            });
    });

    // Find sections and cache the height so we can use for sliding and set ARIA attributes
    this.sections = element.find('.accordion-section').each(function(index) {
        $(this)
            .data('height', $(this).height())
            .attr({
                role: 'tabpanel',
                id: self.id('section', index)
            })
            .aria('labelledby', self.id('header', index))
            .conceal();
    });

    // Last opened section index
    this.index = 0;

    // Last opened header
    this.node = null;

    // Initialize events
    this.events = {};
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
        index = $.bound(index, this.headers.length);

        this.fireEvent('jump', index);
        this.show(this.headers[index]);
    },

    /**
     * Toggle the section display of a row via the header click/hover event.
     * Take into account the multiple and collapsible options.
     *
     * @param {jQuery} header
     */
    show: function(header) {
        header = $(header);

        var options = this.options,
            parent = header.parent(), // li
            section = header.next(), // section
            index = header.data('index'),
            height = parseInt(section.data('height'), 10),
            isNode = (this.node && this.node.is(header));

        // Allow simultaneous open and closed sections
        // Or allow the same section to collapse
        if (options.mode === 'click' && (options.multiple || options.collapsible && isNode)) {
            if (section.is(':shown') && this.node) {
                section.css('max-height', 0).conceal();
                parent.removeClass('is-active');
                header.aria('toggled', false);

            } else {
                section.css('max-height', height).reveal();
                parent.addClass('is-active');
                header.aria('toggled', true);
            }

        // Only one open at a time
        } else {

            // Exit early so we don't mess with animations
            if (isNode) {
                return;
            }

            this.sections.css('max-height', 0).conceal();
            section.css('max-height', height).reveal();

            this.headers.aria('toggled', false);
            header.aria('toggled', true);

            this.element.children('li').removeClass('is-active');
            parent.addClass('is-active');
        }

        this.index = index;
        this.node = header;

        this.fireEvent('show', [section, header, index]);
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
    collapsible: false
});

Toolkit.create('accordion', function(options) {
    return new Toolkit.Accordion(this, options);
});