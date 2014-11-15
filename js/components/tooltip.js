/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    './component',
    '../flags/vendor',
    '../events/clickout',
    '../extensions/position-to',
    '../extensions/shown-selector'
], function($, Toolkit, vendor) {

Toolkit.Tooltip = Toolkit.Component.extend({
    name: 'Tooltip',
    version: '2.0.0',

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
        var element;

        this.options = options = this.setOptions(options);
        this.element = element = this.createElement()
            .attr('role', 'tooltip')
            .removeClass(options.className)
            .css('display', ''); // Remove display none

        // Remove title attributes
        if (options.getTitle === 'title') {
            options.getTitle = 'data-' + this.keyName + '-title';
        }

        // Elements for the title and content
        this.elementHead = element.find(this.ns('header'));
        this.elementBody = element.find(this.ns('content'));

        // Nodes found in the page on initialization, remove title attribute
        this.nodes = $(nodes).each(function(i, node) {
            $(node).attr(options.getTitle, $(node).attr('title')).removeAttr('title');
        });

        // Initialize events
        this.addEvent('{mode}', 'document', 'onShowToggle', '{selector}');

        if (options.mode === 'click') {
            this.addEvents([
                ['clickout', 'element', 'hide'],
                ['clickout', 'document', 'hide', '{selector}']
            ]);
        } else {
            this.addEvent('mouseleave', 'document', 'hide', '{selector}');
        }

        this.initialize();
    },

    /**
     * Hide the tooltip.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.reset();

        this.element.conceal(true);

        if (this.node) {
            this.node.removeAttr('aria-describedby');
        }

        this.fireEvent('hidden');
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

        this.fireEvent('showing');

        // Add position class
        this.element
            .addClass(options.position)
            .addClass(options.className);

        // Set ARIA
        this.node.aria('describedby', this.id());

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

            this.fireEvent('shown');

        // Position accordingly
        } else {
            this.element.positionTo(options.position, this.node, {
                left: options.xOffset,
                top: options.yOffset
            }).reveal(true);

            this.fireEvent('shown');
        }
    },

    /**
     * Reset the current tooltip state by removing position and custom classes.
     */
    reset: function() {
        var options = this.options,
            element = this.element,
            position = element.data('new-position') || this.runtime.position || options.position,
            className = this.runtime.className || options.className;

        this.runtime = {};

        element
            .removeClass(position)
            .removeClass(className)
            .removeData('new-position');
    },

    /**
     * Show the tooltip and determine whether to grab the content from an AJAX call,
     * a DOM node, or plain text. The content and title can also be passed as arguments.
     *
     * @param {jQuery} node
     * @param {String|jQuery} [content]
     */
    show: function(node, content) {
        this.reset();

        this.node = node = $(node);
        this.runtime = this.inheritOptions(this.options, node);

        this.loadContent(content || this.readValue(node, this.runtime.getContent));
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
        }, true).reveal(true);
    },

    /**
     * {@inheritdoc}
     */
    onRequestBefore: function(xhr) {
        Toolkit.Component.prototype.onRequestBefore.call(this, xhr);

        if (this.options.showLoading) {
            this.position(Toolkit.messages.loading);
        }
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
    template: '<div class="' + vendor + 'tooltip">' +
        '<div class="' + vendor + 'tooltip-inner">' +
            '<div class="' + vendor + 'tooltip-head" data-tooltip-header></div>' +
            '<div class="' + vendor + 'tooltip-body" data-tooltip-content></div>' +
        '</div>' +
        '<div class="' + vendor + 'tooltip-arrow"></div>' +
    '</div>'
});

Toolkit.create('tooltip', function(options) {
    return new Toolkit.Tooltip(this, options);
}, true);

return Toolkit;
});