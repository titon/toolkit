/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

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

    /** Dynamic options during runtime */
    runtime: {},

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Elements} elements
     * @param {Object} [options]
     */
    initialize: function(elements, options) {
        this.parent(options);
        this.nodes = elements;
        this.createElement();

        options = this.options;

        // Remove title attributes
        var title = 'data' + this.cssClass + '-title';

        // Fetch elements
        this.elementHead = this.element.getElement(options.titleElement);
        this.elementBody = this.element.getElement(options.contentElement);

        // Add position class
        this.element
            .set('role', 'tooltip')
            .removeClass(options.className);

        this.nodes.each(function(node) {
            node.setProperty(title, node.get('title')).removeProperty('title');
        });

        if (options.getTitle === 'title') {
            options.getTitle = title;
        }

        // Initialize events
        var events = {}, selector = options.delegate;

        if (options.mode === 'click') {
            events['clickout element'] = 'hide';
            events['clickout ' + selector] = 'hide';
        } else {
            events['mouseleave ' + selector] = 'hide';
        }

        events[options.mode + ' ' + selector] = 'onShow';

        this.events = events;

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Remove dynamic options.
     *
     * @returns {Toolkit.Component}
     */
    hide: function() {
        var position = this.element.get('data-new-position') || this.runtime.position || this.options.position,
            className = this.runtime.className || this.options.className;

        this.runtime = {};

        this.element
            .removeClass(position)
            .removeClass(className)
            .removeProperty('data-new-position');

        if (this.node) {
            this.node.removeProperty('aria-describedby');
        }

        return this.parent();
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
        var options = (Object.keys(this.runtime).length) ? this.runtime : this.options;

        // AJAX is currently loading
        if (content === true) {
            return this;
        }

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

            setTimeout(function() {
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
        var options;

        if (node) {
            this.node = node;
            this.runtime = options = this.inheritOptions(this.options, node);

            content = content || this.readValue(node, options.getContent);
        } else {
            this.runtime = options = this.options;
        }

        if (!content) {
            return this;
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

        var options = this.runtime;

        this.element.positionTo(options.position, e, {
            left: options.xOffset,
            top: options.yOffset
        }, true).reveal();
    }

});

/**
 * Defines a component that can be instantiated through tooltip().
 */
Toolkit.create('tooltip', function(options) {
    return new Toolkit.Tooltip(this, options);
}, true);