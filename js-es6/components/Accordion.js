/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import EmbeddedComponent from 'EmbeddedComponent';
import debounce from 'lodash/function/debounce';

export default class Accordion extends EmbeddedComponent {

    /**
     * {@inheritdoc}
     */
    getDefaultOptions() {
        return Accordion.options;
    }

    /**
     * {@inheritdoc}
     */
    setupProperties() {
        super.setupProperties();

        this.name = 'Accordion';
        this.version = '3.0.0';

        /** Collection of header elements. */
        this.headers = this.element.find(this.formatNamespace('header'));

        /** Collection of section elements. */
        this.sections = this.element.find(this.formatNamespace('section'));
    }

    /**
     * {@inheritdoc}
     */
    setupBinds() {
        this.setBinds({
            'horizontalresize window': debounce(this.calculate.bind(this), 150),
            ['{mode} element ' + this.formatNamespace('header')]: 'onClickHeader'
        });
    }

    /**
     * {@inheritdoc}
     */
    startup() {
        this.element.setAttribute('role', 'tablist');

        // Set default ARIA and attributes for all headers
        this.headers.each((header, index) => {
            header
                .setAttributes({
                    'data-accordion-index': index,
                    role: 'tab',
                    id: this.formatID('header', index)
                })
                .setArias({
                    controls: this.formatID('section', index),
                    selected: false,
                    expanded: false
                });
        });

        // Set default ARIA and attributes for all sections
        this.sections.each((section, index) => {
            section
                .setAttributes({
                    role: 'tabpanel',
                    id: this.formatID('section', index)
                })
                .setAria('labelledby', this.formatID('header', index))
                .conceal();
        });

        // Calculate and cache heights of each section
        this.calculate();

        // Set the initial state and render
        this.setState({
            index: this.options.defaultIndex || 0
        });
    }

    /**
     * {@inheritdoc}
     */
    shutdown() {
        this.headers
            .addClass('is-active')
            .setAria('toggled', true);

        this.sections
            .setAttribute('style', '')
            .reveal();
    }

    /**
     * Render the accordion according to the current state by revealing the section and header at the defined index.
     * Take into account multiple and collapsible sections.
     */
    render() {
        let index = this.state.index,
            options = this.options,
            header = this.headers[index],
            section = this.sections[index],
            height = parseInt(section.data('accordion-height'), 10),
            isNode = (this.node === header);

        this.fireEvent('showing', [section, header, this.previousState.index]);

        // Allow simultaneous open and closed sections
        // Or allow the same section to collapse
        if (options.mode === 'click' && (options.multiple || options.collapsible && isNode)) {
            if (section.isVisible() && this.node) {
                section.setStyle('maxHeight', 0).conceal(true);
                header.setAria('toggled', false).removeClass('is-active');

            } else {
                section.setStyle('maxHeight', height).reveal(true);
                header.setAria('toggled', true).addClass('is-active');
            }

        // Only one open at a time
        } else {

            // Exit early so we don't mess with animations
            if (isNode) {
                return;
            }

            // Toggle heights of sections
            this.sections.each(sec => {
                if (sec === section) {
                    sec.setStyle('maxHeight', height).reveal(true);
                } else {
                    sec.setStyle('maxHeight', 0).conceal(true);
                }
            });

            // Toggle header active state
            this.headers.each(head => {
                if (head === header) {
                    head.setAria('toggled', true).addClass('is-active');
                } else {
                    head.setAria('toggled', false).removeClass('is-active');
                }
            });
        }

        this.node = header;

        this.fireEvent('shown', [section, header, index]);
    }

    /**
     * Loop through each section and calculate/cache its current height.
     * An optional callback can be defined that will be used for height calculation.
     *
     * @param {function} [callback]
     */
    calculate(callback) {
        if (typeof callback !== 'function') {
            callback = section => section.offsetHeight;
        }

        this.sections.each(section => {
            var className = section.hasClass('hide') ? 'hide' : 'show',
                maxHeight = section.element.style.maxHeight;

            // Make section visible
            section
                .addClass('no-transition')
                .removeClass(className)
                .setStyle('maxHeight', '')
                .write().then(() => {
                    let height = callback.call(this, section);

                    // Cache the height and set section back to previous state
                    section
                        .setAttribute('data-accordion-height', height)
                        .setStyle('maxHeight', (className === 'show') ? height : maxHeight)
                        .addClass(className)
                        .removeClass('no-transition');
                });
        });
    }

    /**
     * When a header is clicked, update the state to the new index.
     *
     * @param {Event} e
     */
    onClickHeader(e) {
        e.preventDefault();

        this.setState({
            index: parseInt(e.currentTarget.getAttribute('data-accordion-index'), 10)
        });
    }

}

Accordion.options = {
    mode: 'click',
    defaultIndex: 0,
    multiple: false,
    collapsible: false
};
