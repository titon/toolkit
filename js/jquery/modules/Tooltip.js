/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Tooltip = function(nodes, options) {

    /** Custom options */
    this.options = Titon.setOptions($.fn.tooltip.options, options);

    /** List of nodes to activate tooltip */
    this.nodes = $(nodes);

    /** Tooltip wrapper */
    this.element = Titon.createElement(this.options);

    /** Inner elements */
    this.elementHead = null;
    this.elementBody = null;

    /** Cached requests */
    this.cache = {};

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        var options = this.options;

        this.elementHead = this.element.find(options.titleElement);
        this.elementBody = this.element.find(options.contentElement);

        // Add position class
        this.element.addClass(options.position.hyphenate());

        // Set events
        $(options.context || document)
            .on((options.mode === 'click' ? 'click' : 'mouseover'), this.nodes.selector, this.__show.bind(this));
    };

    /**
     * Disable component.
     *
     * @returns {Titon.Tooltip}
     */
    this.disable = function() {
        this.enabled = false;

        return this;
    };

    /**
     * Enable component.
     *
     * @returns {Titon.Tooltip}
     */
    this.enable = function() {
        this.enabled = true;

        return this;
    };

    /**
     * Hide the tooltip.
     *
     * @returns {Titon.Tooltip}
     */
    this.hide = function() {
        this.element.conceal();

        return this;
    };

    /**
     * Positions the tooltip relative to the current node or the mouse cursor.
     * Additionally will apply the title/content and hide/show if necessary.
     *
     * @param {String|jQuery} [content]
     * @param {String|jQuery} [title]
     * @returns {Titon.Tooltip}
     */
    this.position = function(content, title) {
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

        // Follow the mouse
        if (options.follow) {
            var follow = this.__follow.bind(this);

            this.node
                .off('mousemove', follow)
                .on('mousemove', follow);

            // Position accordingly
        } else {
            this.element.positionTo(options.position, this.node, {
                left: options.xOffset,
                top: options.yOffset
            });

            window.setTimeout(function() {
                this.element.reveal();
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
     * @returns {Titon.Tooltip}
     */
    this.show = function(node, content, title) {
        if (node) {
            node = $(node);

            if (this.options.mode === 'hover') {
                node
                    .off('mouseleave', this.hide.bind(this))
                    .on('mouseleave', this.hide.bind(this));
            }

            title = title || Titon.readValue.apply(this, [node, this.options.getTitle]);
            content = content || Titon.readValue.apply(this, [node, this.options.getContent]);
        }

        if (!content) {
            return this;
        }

        this.node = node;

        if (this.options.ajax) {
            if (this.cache[content]) {
                this.position(this.cache[content], title);
            } else {
                $.ajax({
                    url: content,
                    type: 'get',

                    success: function(response) {
                        this.cache[content] = response;

                        if (this.options.showLoading) {
                            this.element.removeClass('is-loading');
                        }

                        this.position(response);
                    }.bind(this),

                    beforeSend: function() {
                        this.cache[content] = true;

                        if (this.options.showLoading) {
                            this.element.addClass('is-loading');

                            this.position(Titon.loadingTemplate('tooltip'));
                        }
                    }.bind(this),

                    error: function() {
                        delete this.cache[content];

                        this.element
                            .removeClass('is-loading')
                            .addClass('has-failed');

                        this.position(Titon.errorTemplate('tooltip'));
                    }.bind(this)
                });
            }
        } else {
            if (content.substr(0, 1) === '#') {
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
    this.__follow = function(e) {
        e.stopPropagation();

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
    this.__show = function(e) {
        e.preventDefault();

        var node = $(e.target);

        if (this.element.is(':shown')) {
            if (this.options.mode === 'click') {
                this.hide();
            }

            // Exit if the same node
            if (this.node && node.get(0) === this.node.get(0)) {
                return;
            }
        }

        this.show(node);
    };

    // Initialize the class only if the element exists
    this.initialize();
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
 * @returns {Titon.Tooltip}
 */
$.fn.tooltip = function(options) {
    if (this.$tooltip) {
        return this.$tooltip;
    }

    this.$tooltip = new Titon.Tooltip(this, options);

    return this.$tooltip;
};

$.fn.tooltip.options = {
    mode: 'hover',
    ajax: false,
    follow: false,
    position: 'topRight',
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

})(jQuery);