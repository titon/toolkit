/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import EmbeddedComponent from '../embedded-component';
import * as dom from '../libs/dom';
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
        this.headers = dom.find(this.ns('header'), this.element);

        // Collection of section elements.
        this.sections = dom.find(this.ns('section'), this.element);
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
        this.element.setAttribute('role', 'tablist');

        // Set default ARIA and attributes for all headers
        this.headers.forEach((header, index) => {
            dom.chain(header)
                .attr({
                    'data-accordion-index': index,
                    role: 'tab',
                    id: this.id('header', index)
                })
                .aria({
                    controls: this.id('section', index),
                    selected: false,
                    expanded: false
                });
        });

        // Set default ARIA and attributes for all sections
        this.sections.forEach((section, index) => {
            dom.chain(section)
                .attr({
                    role: 'tabpanel',
                    id: this.id('section', index)
                })
                .aria('labelledby', this.id('header', index))
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
        dom.chain(this.headers)
            .addClass('is-active')
            .attr('toggled', true);

        dom.chain(this.sections)
            .attr('style', '')
            .reveal();
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
            if (dom.isVisible(section) && this.node) {
                section.style.maxHeight = 0;

                dom.chain(section).conceal(true);

                dom.chain(header)
                    .aria('toggled', false)
                    .removeClass('is-active');

            } else {
                section.style.maxHeight = height;

                dom.chain(section).reveal(true);

                dom.chain(header)
                    .aria('toggled', true)
                    .addClass('is-active');
            }

        // Only one open at a time
        } else {

            // Exit early so we don't mess with animations
            if (isNode) {
                return;
            }

            dom.chain(this.sections)
                .map(section => section.style.maxHeight = 0)
                .conceal(true);

            dom.chain(section)
                .map(section => section.style.maxHeight = height)
                .reveal(true);

            dom.chain(this.headers)
                .aria('toggled', false)
                .removeClass('is-active');

            dom.chain(header)
                .aria('toggled', true)
                .addClass('is-active');
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
            let chain = dom.chain(section),
                className = chain.hasClass('hide') ? 'hide' : 'show',
                maxHeight = section.style.maxHeight,
                height = 0;

            // Make section visible
            chain.addClass('no-transition').removeClass(className);

            section.style.maxHeight = '';

            // Get the height
            height = callback.call(this, section);

            // Cache the height
            chain.attr('data-accordion-height', height);

            // Set section back to previous state
            if (className === 'show') {
                section.style.maxHeight = height;
            } else {
                section.style.maxHeight = maxHeight;
            }

            chain.addClass(className).removeClass('no-transition');
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
