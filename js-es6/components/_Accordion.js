/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import EmbeddedComponent from '../EmbeddedComponent';
import find from '../libs/dom/find';
import debounce from '../libs/function/debounce';

export default class Accordion extends EmbeddedComponent {
    name = 'Accordion';
    version = '3.0.0';

    // Container of header elements.
    headers = null;

    // Container of section elements.
    sections = null;

    /**
     * {@inheritdoc}
     */
    initProperties() {
        this.headers = find(this.ns('header'), this.element);
        this.sections = find(this.ns('section'), this.element);
    }

    /**
     * {@inheritdoc}
     */
    initBinds() {
        this.setBinds({
            'horizontalresize window': debounce(this.calculate),
            ['{mode} element ' + this.ns('header')]: 'onShow'
        });
    }

    /**
     * {@inheritdoc}
     */
    startup() {
        this.element
            .setAttribute('role', 'tablist')
            .write();

        // Set default ARIA and attributes for all headers
        this.headers.each((header, index) => {
            header
                .setAttributes({
                    'data-accordion-index': index,
                    role: 'tab',
                    id: this.id('header', index)
                })
                .setArias({
                    controls: this.id('section', index),
                    selected: false,
                    expanded: false
                })
                .write();
        });

        // Set default ARIA and attributes for all sections
        this.sections.each((section, index) => {
            section
                .setAttributes({
                    role: 'tabpanel',
                    id: this.id('section', index)
                })
                .setAria('labelledby', this.id('header', index))
                .conceal()
                .write();
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
            .setAria('toggled', true)
            .write();

        this.sections
            .setAttribute('style', '')
            .reveal()
            .write();
    }

    /**
     * Render the accordion according to the current state by revealing the section and header at the index.
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
            if (isVisible(section) && this.node) {

                section.setStyle('maxHeight', 0).conceal(true);
                header.setAria('toggled', false).removeClass('is-active');

            } else {
                section.setStyle('maxHeight', height).reveal(true);
                header.setAria('toggled', true).addClass('is-active');
            }

            section.write();
            header.write();

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

                sec.write();
            });

            // Toggle header active state
            this.headers.each(head => {
                if (head === header) {
                    head.setAria('toggled', true).addClass('is-active');
                } else {
                    head.setAria('toggled', false).removeClass('is-active');
                }

                head.write();
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
            callback = (section) => section.offsetHeight;
        }

        this.sections.each(section => {
            let className = section.hasClass('hide') ? 'hide' : 'show',
                maxHeight = section.element.style.maxHeight;

            // Make section visible
            section
                .addClass('no-transition')
                .removeClass(className)
                .setStyle('maxHeight', '')
                .write();

            // Get the height
            let height = callback.call(this, section);

            // Cache the height and set section back to previous state
            section
                .setAttribute('data-accordion-height', height)
                .setStyle('maxHeight', (className === 'show') ? height : maxHeight)
                .addClass(className)
                .removeClass('no-transition')
                .write();
        });
    }

    /**
     * When a header is clicked, update the state to the new index.
     *
     * @param {Event} e
     */
    onShow(e) {
        e.preventDefault();

        this.setState({
            index: e.currentTarget.getAttribute('data-accordion-index')
        });
    }

}

Accordion.options = {
    mode: 'click',
    defaultIndex: 0,
    multiple: false,
    collapsible: false
};
