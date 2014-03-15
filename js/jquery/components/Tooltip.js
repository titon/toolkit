/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Tooltip = Toolkit.Component.extend(function(nodes, options) {
        var element, events;

        this.component = 'Tooltip';
        this.version = '1.2.0';
        this.options = options = this.setOptions(options);
        this.element = element = this.createElement();
        this.elementHead = element.find(options.titleElement);
        this.elementBody = element.find(options.contentElement);
        this.nodes = nodes = $(nodes);
        this.node = null;
        this.cache = {};
        this.events = events = {};
        this.runtime = {};

        // Update ARIA and remove class since were using runtime
        element
            .attr('id', 'toolkit-tooltip-' + this.id)
            .attr('role', 'tooltip')
            .removeClass(options.className);

        // Remove title attributes
        nodes.each(function(i, node) {
            $(node).attr('data-tooltip-title', $(node).attr('title')).removeAttr('title');
        });

        if (options.getTitle === 'title') {
            options.getTitle = 'data-tooltip-title';
        }

        // Initialize events
        if (options.mode === 'click') {
            events['clickout element'] = 'hide';
            events['clickout ' + nodes.selector] = 'hide';
        } else {
            events['mouseleave ' + nodes.selector] = 'hide';
        }

        events[options.mode + ' ' + nodes.selector] = 'onShow';

        this.enable();
        this.fireEvent('init');
    }, {

        /**
         * Hide the tooltip.
         */
        hide: function() {
            var position = this.element.data('new-position') || this.runtime.position || this.options.position,
                className = this.runtime.className || this.options.className;

            this.runtime = {};

            this.element
                .conceal()
                .removeClass(position)
                .removeClass(className)
                .removeData('new-position');

            if (this.node) {
                this.node.removeAttr('aria-describedby');
            }

            this.fireEvent('hide');
        },

        /**
         * Positions the tooltip relative to the current node or the mouse cursor.
         * Additionally will apply the title/content and hide/show if necessary.
         *
         * @param {String|jQuery} [content]
         * @param {String|jQuery} [title]
         */
        position: function(content, title) {
            var options = $.isEmptyObject(this.runtime) ? this.options : this.runtime;

            // AJAX is currently loading
            if (content === true) {
                return;
            }

            // Add position class
            this.element
                .addClass(options.position)
                .addClass(options.className);

            // Set ARIA
            if (this.node) {
                this.node.aria('describedby', 'toolkit-' + this._class() + '-' + this.id);
            }

            // Set title
            title = title || this.readValue(this.node, options.getTitle);

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
                var follow = this.onFollow.bind(this);

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

                setTimeout(function() {
                    this.element.reveal();
                    this.fireEvent('show');
                }.bind(this), options.delay || 0);
            }
        },

        /**
         * Show the tooltip and determine whether to grab the content from an AJAX call,
         * a DOM node, or plain text. The content and title can also be passed as arguments.
         *
         * @param {jQuery} node
         * @param {String|jQuery} [content]
         * @param {String|jQuery} [title]
         */
        show: function(node, content, title) {
            var options;

            if (node) {
                this.node = node = $(node);
                this.runtime = options = this.inheritOptions(this.options, node);

                content = content || this.readValue(node, options.getContent);
            } else {
                this.runtime = options = this.options;
            }

            if (!content) {
                return;
            }

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
                if (content.match(/^#[a-z0-9_\-\.:]+$/i)) {
                    content = $(content).html();
                }

                this.position(content, title);
            }
        },

        /**
         * Event handler for positioning the tooltip by the mouse.
         *
         * @private
         * @param {jQuery.Event} e
         */
        onFollow: function(e) {
            e.preventDefault();

            var options = this.runtime;

            this.element.positionTo(options.position, e, {
                left: options.xOffset,
                top: options.yOffset
            }, true).reveal();
        },

        /**
         * Event handler for showing the tooltip.
         *
         * @private
         * @param {jQuery.Event} e
         */
        onShow: function(e) {
            var node = $(e.target),
                isNode = (this.node && this.node.is(node));

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
        }

    }, {
        mode: 'hover',
        animation: 'fade',
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
    });

    /**
     * Defines a component that can be instantiated through tooltip().
     */
    Toolkit.create('tooltip', function(options) {
        return new Toolkit.Tooltip(this, options);
    }, true);

})(jQuery);