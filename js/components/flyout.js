/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './composite-component',
    '../extensions/shown-selector'
], function($, Toolkit, CompositeComponent) {

var Flyout = Toolkit.Flyout = CompositeComponent.extend({
    name: 'Flyout',
    version: '2.1.3',

    /** Current URL to generate a flyout menu for. */
    url: '',

    /** Raw JSON data. */
    data: [],

    /** Data indexed by URL. */
    dataMap: {},

    /** Show and hide timers. */
    timers: {},

    /**
     * Initialize the flyout. A URL is required during construction.
     *
     * @param {jQuery} nodes
     * @param {String} url
     * @param {Object} [options]
     */
    constructor: function(nodes, url, options) {
        if (Toolkit.isTouch) {
            return; // Flyouts shouldn't be usable on touch devices
        }

        this.nodes = $(nodes);
        options = this.setOptions(options);
        this.createWrapper();

        if (options.mode === 'click') {
            this.addEvents([
                ['click', 'document', 'onShowToggle', '{selector}'],
                ['resize', 'window', $.debounce(this.onHide.bind(this))]
            ]);
        } else {
            this.addEvents([
                ['mouseenter', 'document', 'onShowToggle', '{selector}'],
                ['mouseenter', 'document', 'onEnter', '{selector}'],
                ['mouseleave', 'document', 'onLeave', '{selector}']
            ]);
        }

        this.initialize();

        // Load data from the URL
        if (url) {
            $.getJSON(url, function(response) {
                this.load(response);
            }.bind(this));
        }
    },

    /**
     * Remove timers before destroying.
     */
    destructor: function() {
        this.clearTimer('show');
        this.clearTimer('hide');
    },

    /**
     * Clear a timer by key.
     *
     * @param {String} key
     */
    clearTimer: function(key) {
        clearTimeout(this.timers[key]);
        delete this.timers[key];
    },

    /**
     * Hide the currently shown menu.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.element.conceal();

        this.node.removeClass('is-active');

        this.fireEvent('hidden');
    },

    /**
     * Load the data into the class and save a mapping of it.
     *
     * @param {Object} data
     * @param {Number} [depth]
     */
    load: function(data, depth) {
        depth = depth || 0;

        // If root, store the data
        if (!depth) {
            this.data = data;
        }

        // Store the data indexed by URL
        if (data.url) {
            this.dataMap[data.url] = data;
        }

        if (data.children) {
            for (var i = 0, l = data.children.length; i < l; i++) {
                this.load(data.children[i], depth + 1);
            }
        }
    },

    /**
     * Position the menu below the target node.
     */
    position: function() {
        var options = this.options,
            node = this.node,
            element = this.loadElement(node);

        // Only position if the menu has children
        if (!element.children().length) {
            return;
        }

        this.fireEvent('showing');

        var height = element.outerHeight(),
            coords = node.offset(),
            x = coords.left + options.xOffset,
            y = coords.top + options.yOffset + node.outerHeight(),
            windowScroll = $(window).height(),
            dir = 'left';

        // If menu goes below half page, position it above
        if (y > (windowScroll / 2)) {
            y = coords.top - options.yOffset - height;
        }

        // Change position for RTL
        if (Toolkit.isRTL) {
            x = $(window).width() - coords.left - node.outerWidth();
            dir = 'right';
        }

        element
            .css('top', y)
            .css(dir, x)
            .reveal();

        this.fireEvent('shown');
    },

    /**
     * Show the menu below the node.
     *
     * @param {jQuery} node
     */
    show: function(node) {
        node = $(node);

        var target = this.readValue(node, this.options.getUrl) || node.attr('href');

        // When jumping from one node to another
        // Immediately hide the other menu and start the timer for the current one
        if (this.url && target !== this.url) {
            this.hide();
            this.startTimer('show', this.options.showDelay);
        }

        // Set the state
        this.url = target;
        this.node = node.addClass('is-active');

        // Load the menu
        this.loadElement(node, function(flyout) {
            flyout.addClass('is-root');

            if (this.dataMap[target]) {
                this._buildMenu(flyout, this.dataMap[target]);
            }
        });

        // Display immediately if click
        if (this.options.mode === 'click') {
            this.position();
        }
    },

    /**
     * Add a timer that should trigger a function after a delay.
     *
     * @param {String} key
     * @param {Number} delay
     * @param {Array} [args]
     */
    startTimer: function(key, delay, args) {
        this.clearTimer(key);

        var func;

        if (key === 'show') {
            func = this.position;
        } else {
            func = this.hide;
        }

        if (func) {
            this.timers[key] = setTimeout(function() {
                func.apply(this, args || []);
            }.bind(this), delay);
        }
    },

    /**
     * Build a nested list menu using the data object.
     *
     * @private
     * @param {jQuery} menu
     * @param {Object} data
     */
    _buildMenu: function(menu, data) {
        if (!data.children || !data.children.length) {
            return;
        }

        var options = this.options,
            groups = [],
            ul,
            li,
            tag,
            limit = options.itemLimit,
            i, l;

        if (options.className) {
            menu.addClass(options.className);
        }

        menu
            .aria('expanded', false)
            .attr('role', 'menu');

        if (limit && data.children.length > limit) {
            i = 0;
            l = data.children.length;

            while (i < l) {
                groups.push(data.children.slice(i, i += limit));
            }
        } else {
            groups.push(data.children);
        }

        for (var g = 0, group, child; group = groups[g]; g++) {
            ul = $('<ul/>');

            for (i = 0, l = group.length; i < l; i++) {
                child = group[i];

                // Build tag
                if (child.url) {
                    li = $('<li/>');
                    tag = $('<a/>', {
                        text: child.title,
                        href: child.url,
                        role: 'menuitem'
                    });

                    // Add icon
                    $('<span/>')
                        .addClass(child.icon || (Toolkit.isRTL ? 'caret-left' : 'caret-right'))
                        .prependTo(tag);

                } else {
                    li = this.render(options.template);
                    tag = $('<span/>', {
                        text: child.title,
                        role: 'presentation'
                    });
                }

                if (child.attributes) {
                    tag.attr(child.attributes);
                }

                // Build list
                if (child.className) {
                    li.addClass(child.className);
                }

                li.append(tag).appendTo(ul);

                if (child.children && child.children.length) {
                    var childMenu = this.render(options.template)
                        .conceal()
                        .appendTo(li);

                    this._buildMenu(childMenu, child);

                    li.addClass('has-children')
                        .aria('haspopup', true)
                        .on('mouseenter', this.onPositionChild.bind(this, li))
                        .on('mouseleave', this.onHideChild.bind(this, li));
                }
            }

            menu.append(ul);
        }

        // Only monitor top level menu
        if (options.mode !== 'click' && menu.hasClass('is-root')) {
            menu.on({
                mouseenter: function() {
                    this.clearTimer('hide');
                }.bind(this),
                mouseleave: function() {
                    this.startTimer('hide', options.hideDelay);
                }.bind(this)
            });
        }
    },

    /**
     * Event handle when a mouse enters a node. Will show the menu after the timer.
     *
     * @private
     */
    onEnter: function() {
        this.clearTimer('hide');
        this.startTimer('show', this.options.showDelay);
    },

    /**
     * Event handler to hide the child menu after exiting parent li.
     *
     * @private
     * @param {jQuery} parent
     */
    onHideChild: function(parent) {
        parent = $(parent);
        parent.removeClass('is-open');
        parent.children(this.ns('menu'))
            .removeAttr('style')
            .aria({
                expanded: false,
                hidden: false
            })
            .conceal();

        this.fireEvent('hideChild', [parent]);
    },

    /**
     * Event handle when a mouse leaves a node. Will hide the menu after the timer.
     *
     * @private
     */
    onLeave: function() {
        this.clearTimer('show');
        this.startTimer('hide', this.options.showDelay);
    },

    /**
     * Event handler to position the child menu dependent on the position in the page.
     *
     * @private
     * @param {jQuery} parent
     */
    onPositionChild: function(parent) {
        var menu = parent.children(this.ns('menu'));

        if (!menu) {
            return;
        }

        menu.aria({
            expanded: true,
            hidden: true
        });

        // Alter width because of columns
        var children = menu.children();

        menu.css('width', (children.outerWidth() * children.length) + 'px');

        // Get sizes after menu positioning
        var win = $(window),
            winHeight = win.height() + win.scrollTop(),
            parentOffset = parent.offset(),
            parentHeight = parent.outerHeight(),
            oppositeClass = 'push-opposite';

        // Display menu horizontally on opposite side if it spills out of viewport
        if (Toolkit.isRTL) {
            if ((parentOffset.left - menu.outerWidth()) < 0) {
                menu.addClass(oppositeClass);
            } else {
                menu.removeClass(oppositeClass);
            }
        } else {
            if ((parentOffset.left + parent.outerWidth() + menu.outerWidth()) >= win.width()) {
                menu.addClass(oppositeClass);
            } else {
                menu.removeClass(oppositeClass);
            }
        }

        // Reverse menu vertically if below half way fold
        if (parentOffset.top > (winHeight / 2)) {
            menu.css('top', '-' + (menu.outerHeight() - parentHeight) + 'px');
        } else {
            menu.css('top', 0);
        }

        parent.addClass('is-open');
        menu.reveal();

        this.fireEvent('showChild', [parent]);
    }

}, {
    mode: 'hover',
    getUrl: 'href',
    xOffset: 0,
    yOffset: 0,
    showDelay: 350,
    hideDelay: 1000,
    itemLimit: 15,
    wrapperClass: function(bem) {
        return bem('flyouts');
    },
    template: function(bem) {
        return '<div class="' + bem('flyout') + '" data-flyout-menu></div>';
    },
    headingTemplate: function(bem) {
        return '<li class="' + bem('flyout', 'heading') + '"></li>';
    }
});

Toolkit.createPlugin('flyout', function(url, options) {
    return new Flyout(this, url, options);
}, true);

return Flyout;
});
