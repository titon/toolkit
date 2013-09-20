/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Showcase = function(nodes, options) {

    /** Custom options */
    this.options = Titon.setOptions($.fn.showcase.options, options);

    /** List of nodes to activate showcase */
    this.nodes = $(nodes);

    /** Showcase element */
    this.element = Titon.createElement(this.options);

    /** List elements */
    this.items = null;
    this.tabs = null;

    /** Previous and next buttons */
    this.prevButton = null;
    this.nextButton = null;

    /** List of items data to populate the showcase with **/
    this.data = [];

    /** The current and previous shown indices */
    this.previousIndex = 0;
    this.currentIndex = 0;

    /** Blackout instance if options.blackout is true */
    this.blackout = null;

    /**
     * Initialize the showcase, its elements and events.
     */
    this.initialize = function() {
        var options = this.options;

        // Get elements
        this.items = this.element.find(options.itemsElement);
        this.tabs = this.element.find(options.tabsElement);
        this.prevButton = this.element.find(options.prevElement);
        this.nextButton = this.element.find(options.nextElement);

        // Blackout
        if (options.blackout) {
            this.blackout = new Titon.Blackout();
            this.blackout.element.on('click', this.hide.bind(this));
        }

        // Set events
        $(options.context || document)
            .on('click', this.nodes.selector, this.__show.bind(this));

        $(window).on('keydown', function(e) {
            if (this.element.is(':shown')) {
                switch (e.key.toLowerCase()) {
                    case 'esc':   this.hide(); break;
                    case 'up':    this.jump(0); break;
                    case 'down':  this.jump(-1); break;
                    case 'left':  this.prev(); break;
                    case 'right': this.next(); break;
                }
            }
        }.bind(this));

        this.element
            .on('click', options.closeEvent, this.hide.bind(this))
            .on('click', options.nextEvent, this.next.bind(this))
            .on('click', options.prevEvent, this.prev.bind(this))
            .on('click', options.jumpEvent, this.__jump.bind(this));
    };

    /**
     * Disable component.
     *
     * @returns {Titon.Showcase}
     */
    this.disable = function() {
        this.enabled = false;

        return this;
    };

    /**
     * Enable component.
     *
     * @returns {Titon.Showcase}
     */
    this.enable = function() {
        this.enabled = true;

        return this;
    };

    /**
     * Hide the showcase and reset inner elements.
     *
     * @returns {Titon.Showcase}
     */
    this.hide = function() {
        if (this.element.is(':shown')) {
            this.element.conceal();
            this.element.removeClass('is-single');

            if (this.options.blackout) {
                this.blackout.hide();
            }

            this.items
                .removeAttr('style')
                .children('li').removeClass('show');
        }

        return this;
    };

    /**
     * Jump to a specific item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     * @returns {Titon.Showcase}
     */
    this.jump = function(index) {
        if (index >= this.data.length) {
            index = 0;
        } else if (index < 0) {
            index = this.data.length - 1;
        }

        var options = this.options,
            element = this.element,
            list = this.items,
            listItems = list.children('li'),
            listItem = $(listItems[index]),
            items = this.data,
            item = items[index];

        // Save state
        this.previousIndex = this.currentIndex;
        this.currentIndex = index;

        // Update tabs
        if (this.tabs) {
            var listTabs = this.tabs.find('a');

            listTabs.removeClass('is-active');
            $(listTabs[index]).addClass('is-active');
        }

        // Fade out previous item
        listItems.removeClass('show');

        // Image already exists
        if (listItem.data('width')) {

            // Resize the showcase to the image size
            list.css({
                width: listItem.data('width'),
                height: listItem.data('height')
            });

            // Reveal the image after animation
            setTimeout(function() {
                listItem.addClass('show');
            }, options.transition);

        // Create image and animate
        } else {
            element.addClass('is-loading');

            // Preload image
            var img = new Image();
                img.src = item.image;

            // Resize showcase after image loads
            img.onload = function() {
                list.css({
                    width: this.width,
                    height: this.height
                });

                // Cache the width and height
                listItem
                    .data('width', this.width)
                    .data('height', this.height);

                // Create the caption
                if (item.title) {
                    listItem.append($('<div/>').addClass('showcase-caption').html(item.title));
                }

                // Reveal the image after animation
                setTimeout(function() {
                    element.removeClass('is-loading');
                    listItem.addClass('show').append(img);
                }, options.transition);
            };
        }

        return this;
    };

    /**
     * Go to the next item.
     *
     * @returns {Titon.Showcase}
     */
    this.next = function() {
        this.jump(this.currentIndex + 1);

        return this;
    };

    /**
     * Go to the previous item.
     *
     * @returns {Titon.Showcase}
     */
    this.prev = function() {
        this.jump(this.currentIndex - 1);

        return this;
    };

    /**
     * Reveal the showcase after scraping for items data.
     * Will scrape data from the activating node.
     * If a category exists, scrape data from multiple nodes.
     *
     * @param {Element} node
     * @returns {Titon.Showcase}
     */
    this.show = function(node) {
        this.node = node = $(node);
        this.currentIndex = this.previousIndex = 0;
        this.element.addClass('is-loading');

        var options = this.options,
            read = Titon.readValue.bind(this),
            category = read(node, options.getCategory),
            items = [],
            index = 0;

        // Multiple items based on category
        if (category) {
            for (var i = 0, x = 0, n; n = this.nodes[i]; i++) {
                if (read(n, options.getCategory) === category) {
                    if (n === node) {
                        index = x;
                    }

                    items.push({
                        title: read(n, options.getTitle),
                        category: category,
                        image: read(n, options.getImage)
                    });

                    x++;
                }
            }

        // Single item
        } else {
            items.push({
                title: read(node, options.getTitle),
                category: category,
                image: read(node, options.getImage)
            });
        }

        this._buildItems(items);
        this._position();
        this.jump(index);

        return this;
    };

    /**
     * Build the list of items and tabs based on the generated data.
     * Determine which elements to show and bind based on the data.
     *
     * @private
     * @param {Array} items
     */
    this._buildItems = function(items) {
        this.data = items;
        this.items.empty();
        this.tabs.empty();

        for (var li, a, item, i = 0; item = items[i]; i++) {
            li = $('<li/>');
            li.appendTo(this.items);

            a = $('<a/>')
                .addClass(this.options.jumpEvent.substr(1))
                .attr('href', 'javascript:;')
                .data('index', i);

            li = $('<li/>');
            li.appendTo(this.tabs).append(a);
        }

        if (items.length <= 1) {
            this.element.addClass('is-single');
        }
    };

    /**
     * Position the element in the middle of the screen.
     *
     * @private
     */
    this._position = function() {
        if (!this.element.is(':shown')) {
            if (this.options.blackout) {
                this.blackout.show();
            }

            this.element.reveal();
        }
    };

    /**
     * Event handler for jumping between items.
     *
     * @private
     * @param {DOMEvent} e
     */
    this.__jump = function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.jump($(e.target).data('index') || 0);
    };

    /**
     * Event handler for show().
     *
     * @private
     * @param {Event} e
     */
    this.__show = function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.show(e.currentTarget);
    };

    // Initialize the class only if the element exists
    this.initialize();
};

/**
 * Enable showcase galleries on Elements collections by calling showcase().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('.js-showcase').showcase({
 *         blackout: false
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Showcase}
 */
$.fn.showcase = function(options) {
    if (this.$showcase) {
        return this.$showcase;
    }

    this.$showcase = new Titon.Showcase(this, options);

    return this.$showcase;
};

$.fn.showcase.options = {
    className: '',
    blackout: true,
    transition: 300,
    getCategory: 'data-showcase',
    getImage: 'href',
    getTitle: 'title',
    itemsElement: '.showcase-items',
    tabsElement: '.showcase-tabs',
    prevElement: '.showcase-prev',
    nextElement: '.showcase-next',
    closeEvent: '.showcase-event-close',
    jumpEvent: '.showcase-event-jump',
    prevEvent: '.showcase-event-prev',
    nextEvent: '.showcase-event-next',
    template: '<div class="showcase">' +
        '<div class="showcase-inner">' +
            '<ul class="showcase-items"></ul>' +
            '<ol class="showcase-tabs"></ol>' +
            '<a href="javascript:;" class="showcase-prev showcase-event-prev"><span class="icon-chevron-sign-left"></span></a>' +
            '<a href="javascript:;" class="showcase-next showcase-event-next"><span class="icon-chevron-sign-right"></span></a>' +
            '<button type="button" class="close showcase-event-close">' +
                '<span class="x">&times;</span>' +
            '</button>' +
        '</div>' +
    '</div>'
};

})(jQuery);