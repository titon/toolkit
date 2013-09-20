/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Flyout = function(nodes, url, options) {

    /** Custom options */
    this.options = Titon.setOptions($.fn.flyout.options, options);

    /** Nodes to activate menus on */
    this.nodes = $(nodes);

    /** Currently active node */
    this.node = null;

    /** Currently active menu */
    this.element = null;

    /** The current menu URL being displayed */
    this.current = null;

    /** Collection of menu elements */
    this.menus = {};

    /** Raw data response */
    this.data = [];

    /** Mapping of data indexed by URL */
    this.dataMap = {};

    /** Delay timers */
    this.timers = {};

    /**
     * Fetch elements and attach events.
     */
    this.initialize = function() {
        if (!url) {
            throw new Error('Flyout URL required to download sitemap JSON');
        }

        // Load data from the URL
        $.ajax({
            url: url,
            dataType: 'json',
            success: this.load.bind(this)
        });

        // Set events
        this.disable().enable();

        // Handles keeping menu open even if mouse exits the context
        var options = this.options;

        if (options.mode === 'hover') {
            $(options.context || document)
                .on('mouseenter', this.nodes.selector, function() {
                    this.clearTimer('hide').startTimer('show', options.showDelay);
                }.bind(this))
                .on('mouseleave', this.nodes.selector, function() {
                    this.clearTimer('show').startTimer('hide', options.showDelay);
                }.bind(this));
        }
    };

    /**
     * Enable events.
     *
     * @returns {Titon.Flyout}
     */
    this.enable = function() {
        $(this.options.context || document)
            .on((this.options.mode === 'click' ? 'click' : 'mouseenter'), this.nodes.selector, this._show.bind(this));

        return this;
    };

    /**
     * Disable events.
     *
     * @returns {Titon.Flyout}
     */
    this.disable = function() {
        $(this.options.context || document)
            .off((this.options.mode === 'click' ? 'click' : 'mouseenter'), this.nodes.selector, this._show.bind(this));

        return this;
    };

    /**
     * Clear a timer by key.
     *
     * @returns {Titon.Flyout}
     */
    this.clearTimer = function(key) {
        window.clearTimeout(this.timers[key]);
        delete this.timers[key];

        return this;
    };

    /**
     * Add a timer that should trigger a function after a delay.
     *
     * @returns {Titon.Flyout}
     */
    this.startTimer = function(key, delay, args) {
        this.clearTimer(key);

        var fn;

        if (key === 'show') {
            fn = this._position.bind(this);
        } else {
            fn = this.hide.bind(this);
        }

        if (fn) {
            this.timers[key] = window.setTimeout(function() {
                fn.apply(this, args || []);
            }.bind(this), delay);
        }

        return this;
    };

    /**
     * Hide the currently shown menu.
     *
     * @returns {Titon.Flyout}
     */
    this.hide = function() {
        // Must be called even if the menu is hidden
        this.node.removeClass('is-active');

        if (!this.current || !this.isVisible()) {
            return this;
        }

        this.menus[this.current].conceal();

        // Reset last
        this.current = null;

        return this;
    };

    /**
     * Return true if the current menu exists and is visible.
     *
     * @returns {bool}
     */
    this.isVisible = function() {
        if (this.current && this.menus[this.current]) {
            this.element = this.menus[this.current];
        }

        return (this.element && this.element.is(':shown'));
    };

    /**
     * Load the data into the class and save a mapping of it.
     *
     * @param {Object} data
     * @param {Number} [depth]
     * @returns {Titon.Flyout}
     */
    this.load = function(data, depth) {
        depth = depth || 0;

        // If root, store the data
        if (depth === 0) {
            this.data = data;
        }

        // Store the data indexed by URL
        this.dataMap[data.url] = data;

        if (data.children) {
            for (var i = 0, l = data.children.length; i < l; i++) {
                this.load(data.children[i], depth + 1);
            }
        }

        return this;
    };

    /**
     * Show the menu below the node.
     *
     * @param {jQuery} node
     * @returns {Titon.Flyout}
     */
    this.show = function(node) {
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
            return this;
        }

        this.node.addClass('is-active');

        // Display immediately if click
        if (this.options.mode === 'click') {
            this._position();
        }

        return this;
    };

    /**
     * Build a nested list menu using the data object.
     *
     * @private
     * @param {jQuery} parent
     * @param {Object} data
     * @returns {jQuery}
     */
    this._buildMenu = function(parent, data) {
        if (!data.children || !data.children.length) {
            return null;
        }

        var menu = $(this.options.template),
            groups = [],
            ul,
            li,
            tag,
            target = this.options.contentElement,
            limit = this.options.itemLimit;

        if (this.options.className) {
            menu.addClass(this.options.className);
        }

        if (parent.get(0) === $('body').get(0)) {
            menu.addClass('flyout-root');
        }

        if (limit && data.children.length > limit) {
            groups = data.children.chunk(limit);
        } else {
            groups.push(data.children);
        }

        for (var g = 0, group; group = groups[g]; g++) {
            ul = $('<ul/>');

            for (var i = 0, l = group.length, child; i < l; i++) {
                child = group[i];
                li = $('<li/>');

                // Build tag
                if (child.url) {
                    tag = $('<a/>', {
                        text: child.title,
                        href: child.url
                    });
                } else {
                    tag = $('<span/>', {
                        text: child.title
                    });

                    li.addClass('heading');
                }

                if (child.attributes) {
                    tag.attr(child.attributes);
                }

                // Add icon
                $('<span/>').addClass(child.icon || 'caret-right').prependTo(tag);

                // Build list
                if (child.className) {
                    li.addClass(child.className);
                }

                li.append(tag).appendTo(ul);

                if (child.children && child.children.length) {
                    this._buildMenu(li, child);

                    li.addClass('has-children')
                        .on('mouseenter', this._positionChild.bind(this, li))
                        .on('mouseleave', this._hideChild.bind(this, li));
                }
            }

            if (target) {
                if (target.substr(0, 1) === '.' && menu.hasClass(target.substr(1))) {
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
    };

    /**
     * Get the menu if it exists, else build it and set events.
     *
     * @private
     * @returns {jQuery}
     */
    this._getMenu = function() {
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

            if (this.options.mode === 'hover') {
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
    };

    /**
     * Get the target URL to determine which menu to show.
     *
     * @private
     * @param {jQuery} node
     * @returns {String}
     */
    this._getTarget = function(node) {
        node = $(node || this.node);

        return Titon.getValue.apply(this, [node, this.options.getUrl]) || node.get('href');
    };

    /**
     * Hide the child menu after exiting parent li.
     *
     * @private
     * @param {jQuery} parent
     */
    this._hideChild = function(parent) {
        parent = $(parent);
        parent.removeClass('is-open');
        parent.children(this.options.contentElement).removeAttr('style');
    };

    /**
     * Event handler to show the menu.
     *
     * @private
     * @param {Event} e
     */
    this._show = function(e) {
        e.preventDefault();
        e.stopPropagation();

        var node = $(e.target);

        if (this.isVisible()) {
            if (this.options.mode === 'click') {
                this.hide();
            }

            // Exit if the same node
            if (node.get(0) === this.node.get(0)) {
                return;
            }
        }

        this.show(node);
    };

    /**
     * Position the menu below the target node.
     *
     * @private
     */
    this._position = function() {
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
    };

    /**
     * Position the child menu dependent on the position in the page.
     *
     * @private
     * @param {jQuery} parent
     */
    this._positionChild = function(parent) {
        var menu = parent.children(this.options.contentElement);

        if (!menu) {
            return;
        }

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
            menu.addClass('flyout--left');
        } else {
            menu.removeClass('flyout--left');
        }

        // Reverse menu vertically if below half way fold
        if (parentTop > (winHeight / 2)) {
            menu.css('top', '-' + (menu.outerHeight() - parentHeight) + 'px');
        } else {
            menu.css('top', 0);
        }

        parent.addClass('is-open');
    };

    // Initialize the class only if the element exists
    if (this.nodes.length) {
        this.initialize();
    }
};

/**
 * Enable flyouts on Elements collections by calling flyout().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('.js-flyout').flyout('/sitemap.json', {
 *         ajax: false
 *     });
 *
 * @param {String} url
 * @param {Object} [options]
 * @returns {Titon.Flyout}
 */
$.fn.flyout = function(url, options) {
    if (this.$flyout) {
        return this.$flyout;
    }

    this.$flyout = new Titon.Flyout(this, url, options);

    return this.$flyout;
};

$.fn.flyout.options = {
    className: '',
    context: null,
    mode: 'hover',
    getUrl: 'href',
    xOffset: 0,
    yOffset: 0,
    showDelay: 350,
    hideDelay: 1000,
    itemLimit: 15,
    contentElement: '.flyout',
    template: '<div class="flyout"></div>',
    multiElement: true
};

})(jQuery);