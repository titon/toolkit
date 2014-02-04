/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Tooltip = Toolkit.Component.create(function(nodes, options) {
        this.component = 'Tooltip';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Tooltip.options, options);

        /** List of nodes to activate tooltip */
        this.nodes = $(nodes);

        /** The current node */
        this.node = null;

        /** Tooltip wrapper */
        this.element = this.createElement(this.options);

        /** Inner elements */
        this.elementHead = null;
        this.elementBody = null;

        /** Cached requests */
        this.cache = {};

        this.initialize();
    });

    Toolkit.Tooltip.options = {
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
    };

    var Tooltip = Toolkit.Tooltip.prototype;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    Tooltip.initialize = function() {
        var options = this.options;

        this.elementHead = this.element.find(options.titleElement);
        this.elementBody = this.element.find(options.contentElement);

        // Add position class
        this.element.addClass(options.position.hyphenate());

        // Set events
        $(options.context || document)
            .on((options.mode === 'click' ? 'click' : 'mouseover'), this.nodes.selector, this.__show.bind(this));

        if (options.mode === 'click') {
            this.element.clickout(this.hide.bind(this));
        }

        this.fireEvent('init');
    };

    /**
     * Hide the tooltip.
     *
     * @returns {Toolkit.Tooltip}
     */
    Tooltip.hide = function() {
        this.element.conceal();
        this.fireEvent('hide');

        return this;
    };

    /**
     * Positions the tooltip relative to the current node or the mouse cursor.
     * Additionally will apply the title/content and hide/show if necessary.
     *
     * @param {String|jQuery} [content]
     * @param {String|jQuery} [title]
     * @returns {Toolkit.Tooltip}
     */
    Tooltip.position = function(content, title) {
        var options = this.options;

        // AJAX is currently loading
        if (content === true) {
            return this;
        }

        // Set title
        if (title && options.showTitle) {
            this.elementHead.html(title).show();
        } else {
            this.elementHead.hide();
        }

        // Set body
        if (content) {
            this.elementBody.html(content).show();
        } else {
            this.elementBody.hide();
        }

        this.fireEvent('load', content);

        // Follow the mouse
        if (options.follow) {
            var follow = this.__follow.bind(this);

            this.node
                .off('mousemove', follow)
                .on('mousemove', follow);

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
    };

    /**
     * Show the tooltip and determine whether to grab the content from an AJAX call,
     * a DOM node, or plain text. The content and title can also be passed as arguments.
     *
     * @param {jQuery} node
     * @param {String|jQuery} [content]
     * @param {String|jQuery} [title]
     * @returns {Toolkit.Tooltip}
     */
    Tooltip.show = function(node, content, title) {
        var options = this.options;

        if (node) {
            node = $(node);

            if (options.mode === 'hover') {
                node
                    .off('mouseleave', this.hide.bind(this))
                    .on('mouseleave', this.hide.bind(this));
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
            if (content.match(/^#[a-z0-9_\-\.:]+$/i)) {
                content = $(content).html();
            }

            this.position(content, title);
        }

        return this;
    };

    /**
     * Event handler for positioning the tooltip by the mouse.
     *
     * @private
     * @param {Event} e
     */
    Tooltip.__follow = function(e) {
        e.preventDefault();

        var options = this.options;

        this.element.positionTo(options.position, e, {
            left: options.xOffset,
            top: options.yOffset
        }, true).reveal();
    };

    /**
     * Event handler for showing the tooltip.
     *
     * @private
     * @param {Event} e
     */
    Tooltip.__show = function(e) {
        var node = $(e.target),
            isNode = (this.node && node[0] === this.node[0]);

        if (this.element.is(':shown')) {

            // Touch devices should pass through on second click
            if (Toolkit.isTouch) {
                if (!isNode || this.node.prop('tagName').toLowerCase() !== 'a') {
                    e.preventDefault();
                }

            // Non-touch devices
            } else {
                e.preventDefault();
            }

            // Second click should close it
            if (this.options.mode === 'click') {
                this.hide();
            }

            // Exit if the same node so it doesn't re-open
            if (isNode) {
                return;
            }

        } else {
            e.preventDefault();
        }

        this.show(node);
    };

    /**
     * Enable tooltips on Elements collections by calling tooltip().
     * An object of options can be passed as the 1st argument.
     * The class instance will be cached and returned from this function.
     *
     * @example
     *     $('.js-tooltip').tooltip({
     *         ajax: false
     *     });
     *
     * @param {Object} [options]
     * @returns {jQuery}
     */
    $.fn.tooltip = function(options) {
        var tooltip = new Toolkit.Tooltip(this, options);

        return this.each(function() {
            $(this).addData('toolkit.tooltip', tooltip);
        });
    };

})(jQuery);