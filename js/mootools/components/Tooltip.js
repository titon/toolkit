/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Tooltip = new Class({
    Extends: Toolkit.Component,
    Binds: ['onFollow'],

    /** Inner elements */
    elementHead: null,
    elementBody: null,

    /** Default options */
    options: {
        delegate: '.js-tooltip',
        mode: 'hover',
        ajax: false,
        follow: false,
        position: 'top-center',
        showLoading: true,
        showTitle: true,
        getTitle: 'title',
        getContent: 'data-tooltip',
        mouseThrottle: 50,
        xOffset: 0,
        yOffset: 0,
        delay: 0,
        titleElement: '.tooltip-head',
        contentElement: '.tooltip-body',
        template: '<div class="tooltip">' +
            '<div class="tooltip-inner">' +
                '<div class="tooltip-head"></div>' +
                '<div class="tooltip-body"></div>' +
            '</div>' +
            '<div class="tooltip-arrow"></div>' +
        '</div>'
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Elements} elements
     * @param {Object} [options]
     */
    initialize: function(elements, options) {
        this.parent(options);
        this.setNodes(elements);
        this.createElement();

        // Fetch elements
        this.elementHead = this.element.getElement(this.options.titleElement);
        this.elementBody = this.element.getElement(this.options.contentElement);

        // Add position class
        this.element.addClass(this.options.position);

        // Remove title attributes
        if (this.options.getTitle === 'title') {
            var title = 'data-' + this.className() + '-title';

            this.options.getTitle = title;

            this.nodes.each(function(node) {
                node.setProperty(title, node.get('title')).removeProperty('title');
            });
        }

        // Set events
        this.bindEvents();

        if (this.options.mode === 'click') {
            this.element.addEvent('clickout', this.onHide);
        }

        this.fireEvent('init');
    },

    /**
     * Positions the tooltip relative to the current node or the mouse cursor.
     * Additionally will apply the title/content and hide/show if necessary.
     *
     * @param {String|Element} [content]
     * @param {String|Element} [title]
     * @returns {Toolkit.Tooltip}
     */
    position: function(content, title) {
        var options = this.options;

        // AJAX is currently loading
        if (content === true) {
            return this;
        }

        // Set title
        title = title || this.readValue(this.node, options.getTitle);

        if (title && options.showTitle) {
            this.elementHead.set('html', title).show();
        } else {
            this.elementHead.hide();
        }

        // Set body
        if (content) {
            this.elementBody.set('html', content).show();
        } else {
            this.elementBody.hide();
        }

        this.fireEvent('load', content);

        // Follow the mouse
        if (options.follow) {
            var event = 'mousemove:throttle(' + options.mouseThrottle + ')';

            this.node
                .removeEvent(event, this.onFollow)
                .addEvent(event, this.onFollow);

            this.fireEvent('show');

        // Position accordingly
        } else {
            this.element.positionTo(options.position, this.node, {
                left: options.xOffset,
                top: options.yOffset
            });

            window.setTimeout(function() {
                this.element.reveal();
                this.fireEvent('show');
            }.bind(this), options.delay || 0);
        }

        return this;
    },

    /**
     * Show the tooltip and determine whether to grab the content from an AJAX call,
     * a DOM node, or plain text. The content and title can also be passed as arguments.
     *
     * @param {Element} node
     * @param {String|Element} [content]
     * @param {String|Element} [title]
     * @returns {Toolkit.Tooltip}
     */
    show: function(node, content, title) {
        var options = this.options;

        if (node) {
            if (options.mode !== 'click') {
                node
                    .removeEvent('mouseleave', this.onHide)
                    .addEvent('mouseleave', this.onHide);
            }

            content = content || this.readValue(node, options.getContent);
        }

        if (!content) {
            return this;
        }

        this.node = node;

        if (options.ajax) {
            if (this.cache[content]) {
                this.position(this.cache[content], title);
            } else {
                if (options.showLoading) {
                    this.position(Toolkit.messages.loading);
                }

                this.requestData(content);
            }
        } else {
            this.position(content, title);
        }

        return this;
    },

    /**
     * Event handler for positioning the tooltip by the mouse.
     *
     * @private
     * @param {DOMEvent} e
     */
    onFollow: function(e) {
        e.preventDefault();

        var options = this.options;

        this.element.positionTo(options.position, e, {
            left: options.xOffset,
            top: options.yOffset
        }, true).reveal();
    }

});

    /**
     * Defines a component that can be instantiated through tooltip().
     */
    Toolkit.createComponent('tooltip', function(options) {
        return new Toolkit.Tooltip(this, options);
    }, true);

})();