/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Accordion = new Class({
    Extends: Toolkit.Component,

    /** List of DOM headers */
    headers: [],

    /** List of DOM sections */
    sections: [],

    /** The current index */
    index: 0,

    /** Default options */
    options: {
        mode: 'click',
        defaultIndex: 0,
        multiple: false,
        collapsible: false,
        headerElement: '.accordion-header',
        sectionElement: '.accordion-section'
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.element = element;
        this.options = options = this.inheritOptions(this.options, element);

        // Fetch all the sections and headers
        var sections = element.getElements(options.sectionElement),
            headers = element.getElements(options.headerElement),
            self = this;

        this.headers = headers;
        this.sections = sections;

        // ARIA
        element.set('role', 'tablist');

        // Store the index
        headers.each(function(header, index) {
            header
                .set('data-index', index)
                .set('role', 'tab')
                .set('id', self.id('header', index))
                .aria({
                    controls: self.id('section', index),
                    selected: false,
                    expanded: false
                });
        });

        // Cache the height so we can use for sliding
        sections.each(function(section, index) {
            section
                .set('data-height', section.getHeight())
                .set('role', 'tabpanel')
                .set('id', self.id('section', index))
                .aria('labelledby', self.id('header', index))
                .conceal();
        });

        // Set events
        this.events[options.mode + ' headers'] = 'onShow';

        this.enable();
        this.fireEvent('init');

        this.jump(options.defaultIndex);
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
        index = Number.from(index).bound(this.headers.length);

        this.fireEvent('jump', index);

        return this.show(this.headers[index]);
    },

    /**
     * Toggle the section display of a row via the header click/hover event.
     * Take into account the multiple and collapsible options.
     *
     * @param {Element} header
     * @returns {Toolkit.Accordion}
     */
    show: function(header) {
        var options = this.options,
            parent = header.getParent(), // li
            section = header.getNext(), // section
            index = header.get('data-index'),
            height = section.get('data-height').toInt(),
            closed = { selected: false, expanded: false },
            open = { selected: true, expanded: true };

        // Allow simultaneous open and closed sections
        // Or allow the same section to collapse
        if (options.mode === 'click' && (options.multiple || (options.collapsible && this.node === header))) {
            if (section.isShown() && this.node) {
                section.setStyle('max-height', 0).conceal();
                parent.removeClass('is-active');
                header.aria(closed);

            } else {
                section.setStyle('max-height', height).reveal();
                parent.addClass('is-active');
                header.aria(open);
            }

        // Only one open at a time
        } else {

            // Exit early so we don't mess with animations
            if (this.node === header) {
                return this;
            }

            this.sections.setStyle('max-height', 0).conceal();
            section.setStyle('max-height', height).reveal();

            this.headers.aria(closed);
            header.aria(open);

            this.element.getChildren('li').removeClass('is-active');
            parent.addClass('is-active');
        }

        this.index = index;
        this.node = header;

        this.fireEvent('show', [section, header, index]);

        return this;
    },

    /**
     * Event handler for header element click or hover.
     *
     * @private
     * @param {DOMEvent} e
     */
    onShow: function(e) {
        e.preventDefault();

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
Toolkit.create('accordion', function(options) {
    return new Toolkit.Accordion(this, options);
});