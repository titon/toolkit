define([
    'jquery',
    './component',
    '../events/clickout',
    '../extensions/position-to',
    '../extensions/shown-selector'
], function($, Toolkit) {

Toolkit.Tooltip = Toolkit.Component.extend({
    name: 'Tooltip',
    version: '1.5.0',

    /** The element to insert the title. */
    elementHead: null,

    /** The element to insert the content. */
    elementBody: null,

    /**
     * Initialize the tooltip.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        var element, vendor = Toolkit.vendor, key = this.keyName;

        this.options = options = this.setOptions(options);
        this.element = element = this.createElement()
            .attr('role', 'tooltip')
            .removeClass(options.className);

        // Remove title attributes
        if (options.getTitle === 'title') {
            options.getTitle = 'data-' + key + '-title';
        }

        // Elements for the title and content
        this.elementHead = element.find('.' + vendor + key + '-head');
        this.elementBody = element.find('.' + vendor + key + '-body');

        // Nodes found in the page on initialization, remove title attribute
        this.nodes = $(nodes).each(function(i, node) {
            $(node).attr('data-' + key + '-title', $(node).attr('title')).removeAttr('title');
        });

        // Initialize events
        this.events = {
            '{mode} document {selector}': 'onShow'
        };

        if (options.mode === 'click') {
            this.events['clickout element'] = 'hide';
            this.events['clickout document {selector}'] = 'hide';
        } else {
            this.events['mouseleave document {selector}'] = 'hide';
        }

        this.initialize();
    },

    /**
     * Hide the tooltip.
     */
    hide: function() {
        var options = this.options,
            element = this.element,
            position = element.data('new-position') || this.runtime.position || options.position,
            className = this.runtime.className || options.className;

        this.runtime = {};

        element
            .removeClass(position)
            .removeClass(className)
            .removeData('new-position')
            .conceal();

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
            this.node.aria('describedby', this.id());
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

        this.fireEvent('load', [content]);

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

        } else if (content.match(/^#[a-z0-9_\-\.:]+$/i)) {
            content = $(content).html();
            options.ajax = false;
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
    template: '<div class="tooltip">' +
        '<div class="tooltip-inner">' +
            '<div class="tooltip-head"></div>' +
            '<div class="tooltip-body"></div>' +
        '</div>' +
        '<div class="tooltip-arrow"></div>' +
    '</div>'
});

Toolkit.create('tooltip', function(options) {
    return new Toolkit.Tooltip(this, options);
}, true);

return Toolkit;
});