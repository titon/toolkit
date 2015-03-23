/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import EmbeddedComponent from '../embedded-component';
import { batch, find, isVisible } from '../libs/dom';
import debounce from '../libs/function';

export default class Accordion extends EmbeddedComponent {

    /**
     * {@inheritdoc}
     */
    initProperties() {
        super.initProperties();

        this.name = 'Accordion';
        this.version = '3.0.0';

        // Collection of header elements.
        this.headers = find(this.ns('header'), this.element);

        // Collection of section elements.
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
        batch(this.element, (element) => {
            element.setAttribute('role', 'tablist');

            // Set default ARIA and attributes for all headers
            this.headers.forEach((header, index) => {
                header
                    .setAttributes({
                        'data-accordion-index': index,
                        role: 'tab',
                        id: this.id('header', index)
                    })
                    .setAria({
                        controls: this.id('section', index),
                        selected: false,
                        expanded: false
                    });
            });

            // Set default ARIA and attributes for all sections
            this.sections.forEach((section, index) => {
                section
                    .setAttributes({
                        role: 'tabpanel',
                        id: this.id('section', index)
                    })
                    .setAria('labelledby', this.id('header', index))
                    .conceal();
            });
        }, this);

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
        batch(this.element, () => {
            this.headers.forEach(header => {
                header
                    .addClass('is-active')
                    .setAria('toggled', true);
            });

            this.sections.forEach(section => {
                section
                    .setAttribute('style', '')
                    .reveal();
            });
        }, this);
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

        // Only one open at a time
        } else {

            // Exit early so we don't mess with animations
            if (isNode) {
                return;
            }

            batch(this.element, () => {
                // Toggle heights of sections
                this.sections.forEach(sec => {
                    if (sec === section) {
                        sec.setStyle('maxHeight', height).reveal(true);
                    } else {
                        sec.setStyle('maxHeight', 0).conceal(true);
                    }
                });

                // Toggle header active state
                this.headers.forEach(head => {
                    if (head === header) {
                        head.setAria('toggled', true).addClass('is-active');
                    } else {
                        head.setAria('toggled', false).removeClass('is-active');
                    }
                });
            }, this);
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

        this.sections.forEach((section) => {
            let className = section.hasClass('hide') ? 'hide' : 'show',
                maxHeight = section.style.maxHeight;

            // Make section visible
            section
                .addClass('no-transition')
                .removeClass(className)
                .setStyle('maxHeight', '');

            // Get the height
            let height = callback.call(this, section);

            // Cache the height
            section.setAttribute('data-accordion-height', height);

            // Set section back to previous state
            section
                .setStyle('maxHeight', (className === 'show') ? height : maxHeight)
                .addClass(className)
                .removeClass('no-transition');
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
