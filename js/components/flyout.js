define([
    './component',
    '../extensions/shown-selector'
], function(Toolkit) {

Toolkit.Flyout = Toolkit.Component.extend({
    name: 'Flyout',
    version: '1.4.0',

    /** Current URL to generate a flyout menu for. */
    current: null,

    /** Collection of flyout elements indexed by URL. */
    menus: {},

    /** Raw sitemap JSON data. */
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
        if (!url) {
            throw new Error('Flyout URL required to download sitemap JSON');
        }

        this.nodes = $(nodes);
        this.options = options = this.setOptions(options);

        if (options.mode === 'click') {
            this.events['click document {selector}'] = 'onShowToggle';
        } else {
            this.events['mouseenter document {selector}'] = ['onShowToggle', 'onEnter'];
            this.events['mouseleave document {selector}'] = 'onLeave';
        }

        this.initialize();

        // Load data from the URL
        $.getJSON(url, this.load);
    },

    /**
     * Remove all the flyout menu elements and timers before destroying.
     */
    destructor: function() {
        $.each(this.menus, function(i, menu) {
            menu.remove();
        });

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
        // Must be called even if the menu is hidden
        if (this.node) {
            this.node.removeClass('is-active');
        }

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

                    li.addClass(Toolkit.vendor + 'flyout-heading');
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

            menu.append(ul);
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
        parent.children('.' + Toolkit.vendor + 'flyout')
            .removeAttr('style')
            .aria({
                expanded: false,
                hidden: false
            });

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
        var menu = parent.children('.' + Toolkit.vendor + 'flyout');

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

        this.fireEvent('showChild', [parent]);
    },

    /**
     * Event handler to show the menu.
     *
     * @param {jQuery.Event} e
     * @private
     */
    onShowToggle: function(e) {

        // Flyouts shouldn't be usable on touch devices
        if (Toolkit.isTouch) {
            return;
        }

        // Set the current element
        this.isVisible();

        // Trigger the parent
        Toolkit.Component.prototype.onShowToggle.call(this, e);
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

Toolkit.create('flyout', function(url, options) {
    return new Toolkit.Flyout(this, url, options);
}, true);

return Toolkit;
});