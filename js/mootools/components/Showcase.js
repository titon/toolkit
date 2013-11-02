/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Showcase = new Class({
    Extends: Titon.Component,
    Binds: ['next', 'prev', '__jump'],

    /** List elements */
    items: null,
    tabs: null,

    /** Previous and next buttons */
    prevButton: null,
    nextButton: null,

    /** List of items data to populate the showcase with **/
    data: [],

    /** The current and previous shown indices */
    previousIndex: 0,
    currentIndex: 0,

    /** Blackout instance if options.blackout is true */
    blackout: null,

    /** Default options */
    options: {
        delegate: '.js-showcase',
        blackout: true,
        transition: 300,
        gutter: 50,
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
                '<ol class="showcase-tabs bullets"></ol>' +
                '<a href="javascript:;" class="showcase-prev showcase-event-prev"><span class="icon-chevron-sign-left"></span></a>' +
                '<a href="javascript:;" class="showcase-next showcase-event-next"><span class="icon-chevron-sign-right"></span></a>' +
                '<a href="javascript:;" class="showcase-close showcase-event-close">' +
                    '<span class="x">&times;</span>' +
                '</a>' +
            '</div>' +
        '</div>',

        // Events
        onJump: null
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Elements} elements
     * @param {Object} [options]
     */
    initialize: function(elements, options) {
        this.parent(options);
        this.setNodes(elements);
        this.createElement();

        // Doesn't support animations
        if (Browser.ie8 || Browser.ie9) {
            this.options.transition = 1;
        }

        options = this.options;

        // Get elements
        this.items = this.element.getElement(options.itemsElement);
        this.tabs = this.element.getElement(options.tabsElement);
        this.prevButton = this.element.getElement(options.prevElement);
        this.nextButton = this.element.getElement(options.nextElement);

        // Blackout
        if (this.options.blackout) {
            this.blackout = new Titon.Blackout();
            this.blackout.element.addEvent('click', this.__hide);
        }

        // Set events
        this.bindEvents();
        this.fireEvent('init');
    },

    /**
     * Set navigation events.
     *
     * @returns {Titon.Showcase}
     */
    bindEvents: function() {
        this.parent();

        window.addEvent('keydown', function(e) {
            if (this.isVisible()) {
                if (['up', 'down', 'left', 'right'].contains(e.key)) {
                    e.preventDefault();
                }

                switch (e.key) {
                    case 'esc':   this.hide(); break;
                    case 'up':    this.jump(0); break;
                    case 'down':  this.jump(-1); break;
                    case 'left':  this.prev(); break;
                    case 'right': this.next(); break;
                }
            }
        }.bind(this));

        this.element
            .addEvent('click:relay(' + this.options.closeEvent + ')', this.__hide)
            .addEvent('click:relay(' + this.options.nextEvent + ')', this.next)
            .addEvent('click:relay(' + this.options.prevEvent + ')', this.prev)
            .addEvent('click:relay(' + this.options.jumpEvent + ')', this.__jump)
            .addEvent('swipeleft', this.next)
            .addEvent('swiperight', this.prev);

        return this;
    },

    /**
     * Hide the showcase and reset inner elements.
     *
     * @returns {Titon.Showcase}
     */
    hide: function() {
        this.parent(function() {
            if (this.options.blackout) {
                this.blackout.hide();
            }

            this.element.removeClass('is-single');

            this.items
                .removeProperty('style')
                .getElements('li').removeClass('show');
        }.bind(this));

        return this;
    },

    /**
     * Jump to a specific item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     * @returns {Titon.Showcase}
     */
    jump: function(index) {
        if (index >= this.data.length) {
            index = 0;
        } else if (index < 0) {
            index = this.data.length - 1;
        }

        var self = this,
            options = this.options,
            element = this.element,
            list = this.items,
            listItems = list.getElements('li'),
            listItem = listItems[index],
            items = this.data,
            item = items[index];

        // Save state
        this.previousIndex = this.currentIndex;
        this.currentIndex = index;

        // Update tabs
        if (this.tabs) {
            var listTabs = this.tabs.getElements('a');

            listTabs.removeClass('is-active');
            listTabs[index].addClass('is-active');
        }

        // Fade out previous item
        listItems.removeClass('show');

        // Image already exists
        if (listItem.hasAttribute('data-width')) {

            // Resize the showcase to the image size
            this._resize(listItem.get('data-width').toInt(), listItem.get('data-height').toInt());

            // Reveal the image after animation
            setTimeout(function() {
                listItem.addClass('show');
                self._reposition();
            }, options.transition);

        // Create image and animate
        } else {
            element.addClass('is-loading');

            // Preload image
            var img = new Image();
                img.src = item.image;

            // Resize showcase after image loads
            img.onload = function() {
                self._resize(this.width, this.height);

                // Cache the width and height
                listItem
                    .set('data-width', this.width)
                    .set('data-height', this.height);

                // Create the caption
                if (item.title) {
                    listItem.grab(new Element('div.showcase-caption').set('html', item.title));
                }

                // Reveal the image after animation
                setTimeout(function() {
                    element.removeClass('is-loading');
                    listItem.addClass('show').grab(img);
                    self._reposition();
                }, options.transition);
            };
        }

        this.fireEvent('jump', index);

        return this;
    },

    /**
     * Go to the next item.
     *
     * @returns {Titon.Showcase}
     */
    next: function() {
        this.jump(this.currentIndex + 1);

        return this;
    },

    /**
     * Position the element in the middle of the screen.
     *
     * @returns {Titon.Showcase}
     */
    position: function() {
        if (!this.isVisible()) {
            if (this.options.blackout) {
                this.blackout.show();
            }

            this.element.reveal();
            this._reposition();
        }

        this.fireEvent('show');

        return this;
    },

    /**
     * Go to the previous item.
     *
     * @returns {Titon.Showcase}
     */
    prev: function() {
        this.jump(this.currentIndex - 1);

        return this;
    },

    /**
     * Reveal the showcase after scraping for items data.
     * Will scrape data from the activating node.
     * If a category exists, scrape data from multiple nodes.
     *
     * @param {Element} node
     * @returns {Titon.Showcase}
     */
    show: function(node) {
        this.node = node;
        this.currentIndex = this.previousIndex = 0;
        this.element.addClass('is-loading');

        var options = this.options,
            read = this.readValue,
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
        this.position();
        this.jump(index);

        return this;
    },

    /**
     * Build the list of items and tabs based on the generated data.
     * Determine which elements to show and bind based on the data.
     *
     * @private
     * @param {Array} items
     * @returns {Titon.Showcase}
     */
    _buildItems: function(items) {
        this.data = items;
        this.items.empty();
        this.tabs.empty();

        for (var li, a, item, i = 0; item = items[i]; i++) {
            li = new Element('li');
            li.inject(this.items);

            a = new Element('a')
                .set('class', this.options.jumpEvent.substr(1))
                .set('href', 'javascript:;')
                .set('data-index', i);

            li = new Element('li');
            li.inject(this.tabs).grab(a);
        }

        if (items.length <= 1) {
            this.element.addClass('is-single');
        }

        return this;
    }.protect(),

    /**
     * Re-position the showcase modal for older browsers.
     *
     * @private
     * @return {Titon.Showcase}
     */
    _reposition: function() {
        if (!Browser.ie8) {
            return this;
        }

        var size = this.element.getSize();

        this.element.setStyles({
            'margin-left': -(size.x / 2),
            'margin-top': -(size.y / 2)
        });

        return this;
    },

    /**
     * Resize the showcase modal when it is larger than the current viewport.
     *
     * @private
     * @param {Number} width
     * @param {Number} height
     * @return {Titon.Showcase}
     */
    _resize: function(width, height) {
        var size = window.getSize(),
            ratio, diff;

        if (width > size.x) {
            var newWidth = (size.x - (this.options.gutter * 2)); // leave edge gap

            ratio = (width / height);
            diff = (width - newWidth);
            width = newWidth;
            height -= Math.round(diff / ratio);

        } else if (height > size.y) {
            var newHeight = (size.y - (this.options.gutter * 2)); // leave edge gap

            ratio = (height / width);
            diff = (height - newHeight);

            width -= Math.round(diff / ratio);
            height = newHeight;
        }

        this.items.setStyles({
            width: width,
            height: height
        });

        return this;
    },

    /**
     * Event handler for jumping between items.
     *
     * @private
     * @param {DOMEvent} e
     */
    __jump: function(e) {
        e.stop();

        this.jump(e.target.get('data-index') || 0);
    }

});

/**
 * Enable showcase galleries on Elements collections by calling showcase().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $$('.js-showcase').showcase({
 *         blackout: false
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Showcase}
 */
Elements.implement('showcase', function(options) {
    var showcase = new Titon.Showcase(this, options);

    return this.each(function(el) {
        if (!el.$showcase) {
            el.$showcase = showcase;
        }
    });
});

})();