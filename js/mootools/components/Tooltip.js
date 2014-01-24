/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Tooltip = new Class({
    Extends: Toolkit.Component,
    Binds: ['__follow'],

    /** Inner elements */
    elementHead: null,
    elementBody: null,

    /** Default options */
    options: {
        delegate: '.js-tooltip',
        mode: 'hover',
        ajax: false,
        follow: false,
        position: 'topCenter',
        loadingMessage: Toolkit.messages.loading,
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
        this.element.addClass(this.options.position.hyphenate());

        // Set events
        this.bindEvents();

        if (this.options.mode === 'click') {
            this.element.clickout(this.__hide);
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
                .removeEvent(event, this.__follow)
                .addEvent(event, this.__follow);

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
            if (options.mode === 'hover') {
                node
                    .removeEvent('mouseleave', this.__hide)
                    .addEvent('mouseleave', this.__hide);
            }

            title = title || this.readValue(node, options.getTitle);
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
                    this.position(options.loadingMessage);
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
    __follow: function(e) {
        e.preventDefault();

        var options = this.options;

        this.element.positionTo(options.position, e, {
            left: options.xOffset,
            top: options.yOffset
        }, true).reveal();
    }

});

/**
 * Enable tooltips on Elements collections by calling tooltip().
 * An object of options can be passed as the 1st argument.
 *
 * @example
 *     $$('.js-tooltip').tooltip({
 *         ajax: false
 *     });
 *
 * @param {Object} [options]
 * @returns {Element}
 */
Elements.implement('tooltip', function(options) {
    var tooltip = new Toolkit.Tooltip(this, options);

    return this.each(function(el) {
        if (!el.$tooltip) {
            el.$tooltip = tooltip;
        }
    });
});

})();