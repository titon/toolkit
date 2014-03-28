/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Flyout = Toolkit.Component.extend(function(nodes, url, options) {
    if (!url) {
        throw new Error('Flyout URL required to download sitemap JSON');
    }

    this.component = 'Flyout';
    this.version = '1.4.0';
    this.options = options = this.setOptions(options);

    // Last opened flyout menu
    this.element = null;

    // Nodes found in the page on initialization
    this.nodes = nodes = $(nodes);

    // Last node to open a menu
    this.node = null;

    // Current URL to relate a flyout menu to
    this.current = null;

    // Collection of flyout elements indexed by URL
    this.menus = {};

    // Raw sitemap JSON data
    this.data = [];

    // Data indexed by URL
    this.dataMap = {};

    // Show and hide timers
    this.timers = {};

    // Initialize events
    this.events = {};

    if (options.mode === 'click') {
        this.events['click ' + nodes.selector] = 'onShow';
    } else {
        this.events['mouseenter ' + nodes.selector] = ['onShow', 'onEnter'];
        this.events['mouseleave ' + nodes.selector] = 'onLeave';
    }

    this.enable();
    this.fireEvent('init');

    // Load data from the URL
    $.getJSON(url, this.load.bind(this));
}, {

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
        // Must be called even if the menu is hidden
        this.node.removeClass('is-active');

        if (!this.current || !this.isVisible()) {
            return;
        }

        this.menus[this.current].conceal();
        this.fireEvent('hide');

        // Reset last
        this.current = null;
    },

    /**
     * Return true if the current menu exists and is visible.
     *
     * @returns {bool}
     */
    isVisible: function() {
        if (this.current && this.menus[this.current]) {
            this.element = this.menus[this.current];
        }

        return (this.element && this.element.is(':shown'));
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
        if (depth === 0) {
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
        var target = this.current,
            options = this.options;

        if (!this.menus[target]) {
            return;
        }

        var menu = this.menus[target],
            height = menu.outerHeight(),
            coords = this.node.offset(),
            x = coords.left + options.xOffset,
            y = coords.top + options.yOffset + this.node.outerHeight(),
            windowScroll = $(window).height();

        // If menu goes below half page, position it above
        if (y > (windowScroll / 2)) {
            y = coords.top - options.yOffset - height;
        }

        menu.css({
            left: x,
            top: y
        }).reveal();

        this.fireEvent('show');
    },

    /**
     * Show the menu below the node.
     *
     * @param {jQuery} node
     */
    show: function(node) {
        var target = this._getTarget(node);

        // When jumping from one node to another
        // Immediately hide the other menu and start the timer for the current one
        if (this.current && target !== this.current) {
            this.hide();
            this.startTimer('show', this.options.showDelay);
        }

        this.node = $(node);

        // Find the menu, else create it
        if (!this._getMenu()) {
            return;
        }

        this.node.addClass('is-active');

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
            func = this.position.bind(this);
        } else {
            func = this.hide.bind(this);
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
     * @param {jQuery} parent
     * @param {Object} data
     * @returns {jQuery}
     */
    _buildMenu: function(parent, data) {
        if (!data.children || !data.children.length) {
            return null;
        }

        var options = this.options,
            menu = $(options.template).attr('role', 'menu').aria('hidden', true),
            groups = [],
            ul,
            li,
            tag,
            target = '.' + vendor + 'flyout',
            limit = options.itemLimit,
            i, l;

        if (options.className) {
            menu.addClass(options.className);
        }

        if (parent.is('body')) {
            menu.addClass('is-root');
        } else {
            menu.aria('expanded', false);
        }

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
                li = $('<li/>');

                // Build tag
                if (child.url) {
                    tag = $('<a/>', {
                        text: child.title,
                        href: child.url,
                        role: 'menuitem'
                    });

                    // Add icon
                    $('<span/>').addClass(child.icon || 'caret-right').prependTo(tag);
                } else {
                    tag = $('<span/>', {
                        text: child.title,
                        role: 'presentation'
                    });

                    li.addClass(vendor + 'flyout-heading');
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
                    this._buildMenu(li, child);

                    li.addClass('has-children')
                        .aria('haspopup', true)
                        .on('mouseenter', this.onPositionChild.bind(this, li))
                        .on('mouseleave', this.onHideChild.bind(this, li));
                }
            }

            if (target) {
                if (menu.is(target)) {
                    menu.append(ul);
                } else {
                    menu.find(target).append(ul);
                }
            } else {
                menu.append(ul);
            }
        }

        menu.appendTo(parent);

        return menu;
    },

    /**
     * Get the menu if it exists, else build it and set events.
     *
     * @private
     * @returns {jQuery}
     */
    _getMenu: function() {
        var target = this._getTarget();

        if (this.menus[target]) {
            this.current = target;

            return this.menus[target];
        }

        if (this.dataMap[target]) {
            var menu = this._buildMenu($('body'), this.dataMap[target]);

            if (!menu) {
                return null;
            }

            menu.conceal();

            if (this.options.mode !== 'click') {
                menu.on({
                    mouseenter: function() {
                        this.clearTimer('hide');
                    }.bind(this),
                    mouseleave: function() {
                        this.startTimer('hide', this.options.hideDelay);
                    }.bind(this)
                });
            }

            this.current = target;
            this.menus[target] = menu;

            return this.menus[target];
        }

        return null;
    },

    /**
     * Get the target URL to determine which menu to show.
     *
     * @private
     * @param {jQuery} [node]
     * @returns {String}
     */
    _getTarget: function(node) {
        node = $(node || this.node);

        return this.readValue(node, this.options.getUrl) || node.attr('href');
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
        parent.children('.' + vendor + 'flyout')
            .removeAttr('style')
            .aria({
                expanded: false,
                hidden: false
            });

        this.fireEvent('hideChild', parent);
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
        var menu = parent.children('.' + vendor + 'flyout');

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
            winWidth = win.width(),
            parentTop = parent.offset().top,
            parentHeight = parent.outerHeight(),
            parentRight = parent.offset().left + parent.outerWidth();

        // Display menu horizontally on opposite side if it spills out of viewport
        var hWidth = parentRight + menu.outerWidth();

        if (hWidth >= winWidth) {
            menu.addClass('push-left');
        } else {
            menu.removeClass('push-left');
        }

        // Reverse menu vertically if below half way fold
        if (parentTop > (winHeight / 2)) {
            menu.css('top', '-' + (menu.outerHeight() - parentHeight) + 'px');
        } else {
            menu.css('top', 0);
        }

        parent.addClass('is-open');

        this.fireEvent('showChild', parent);
    },

    /**
     * Event handler to show the menu.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onShow: function(e) {
        var node = $(e.target),
            isNode = (this.node && node[0] === this.node[0]);

        if (this.isVisible()) {

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
    getUrl: 'href',
    xOffset: 0,
    yOffset: 0,
    showDelay: 350,
    hideDelay: 1000,
    itemLimit: 15,
    template: '<div class="flyout"></div>'
});

/**
 * Defines a component that can be instantiated through flyout().
 */
Toolkit.create('flyout', function(url, options) {
    return new Toolkit.Flyout(this, url, options);
}, true);