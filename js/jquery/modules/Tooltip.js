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

    this.cache = {};

    this.initialize = function() {
        this.elementHead = this.element.find(this.options.titleElement);
        this.elementBody = this.element.find(this.options.contentElement);

        // Add position class
        this.element.addClass(this.options.position.hyphenate());

        // Set events
        this.disable().enable();
    };

    this.enable = function() {
        $(this.options.context || document)
            .on((this.options.mode === 'click' ? 'click' : 'mouseover'), this.nodes.selector, this._show.bind(this));

        return this;
    };

    this.disable = function() {
        $(this.options.context || document)
            .off((this.options.mode === 'click' ? 'click' : 'mouseover'), this.nodes.selector, this._show.bind(this));

        return this;
    };

    this.hide = function() {
        this.element.conceal();

        return this;
    };

    this.show = function(node, content, title) {
        if (node) {
            node = $(node);

            if (this.options.mode === 'hover') {
                node
                    .off('mouseleave', this.hide.bind(this))
                    .on('mouseleave', this.hide.bind(this));
            }

            title = title || Titon.getValue.apply(this, [node, this.options.getTitle]);
            content = content || Titon.getValue.apply(this, [node, this.options.getContent]);
        }

        if (!content) {
            return this;
        }

        this.node = node;

        if (this.options.ajax) {
            if (this.cache[content]) {
                this._position(this.cache[content], title);
            } else {
                $.ajax({
                    url: content,
                    type: 'get',

                    success: function(response) {
                        this.cache[content] = response;

                        if (this.options.showLoading) {
                            this.element.removeClass('is-loading');
                        }

                        this._position(response);
                    }.bind(this),

                    beforeSend: function() {
                        this.cache[content] = true;

                        if (this.options.showLoading) {
                            this.element.addClass('is-loading');

                            this._position(Titon.loadingTemplate('tooltip'));
                        }
                    }.bind(this),

                    error: function() {
                        delete this.cache[content];

                        this.element
                            .removeClass('is-loading')
                            .addClass('has-failed');

                        this._position(Titon.errorTemplate('tooltip'));
                    }.bind(this)
                });
            }
        } else {
            if (content.substr(0, 1) === '#') {
                content = $(content).html();
            }

            this._position(content, title);
        }

        return this;
    };

    this._follow = function(e) {
        e.stopPropagation();

        var options = this.options;

        this.element.positionTo(options.position, e, {
            left: options.xOffset,
            top: options.yOffset
        }, true).reveal();
    };

    this._position = function(content, title) {
        var options = this.options;

        // AJAX is currently loading
        if (content === true) {
            return;
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
            var follow = this._follow.bind(this);

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
    };

    this._show = function(e) {
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
    if (this.nodes.length) {
        this.initialize();
    }
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