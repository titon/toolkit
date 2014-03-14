/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Showcase = new Class({
    Extends: Toolkit.Component,
    Binds: ['next', 'prev', 'onJump'],

    /** List elements */
    items: null,
    tabs: null,

    /** Previous and next buttons */
    prevButton: null,
    nextButton: null,

    /** List of items data to populate the showcase with **/
    data: [],

    /** The current index */
    index: 0,

    /** Blackout instance if options.blackout is true */
    blackout: null,

    /** Default options */
    options: {
        delegate: '.js-showcase',
        blackout: true,
        stopScroll: true,
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
                '<button type="button" class="showcase-prev showcase-event-prev"><span class="arrow-left"></span></button>' +
                '<button type="button" class="showcase-next showcase-event-next"><span class="arrow-right"></span></button>' +
                '<button type="button" class="showcase-close showcase-event-close"><span class="x"></span></button>' +
            '</div>' +
        '</div>'
    },

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

        // IE doesn't support animations
        if (!Toolkit.hasTransition) {
            this.options.transition = 1;
        }

        options = this.options;

        // Get elements
        this.items = this.element.getElement(options.itemsElement);
        this.tabs = this.element.getElement(options.tabsElement);
        this.prevButton = this.element.getElement(options.prevElement);
        this.nextButton = this.element.getElement(options.nextElement);

        // Increase gutter
        options.gutter += (this.element.getHeight() - this.items.getHeight());

        // Blackout
        if (this.options.blackout) {
            this.blackout = Toolkit.Blackout.factory();
        }

        // Initialize events
        var events = {};
        this.events = events = {
            'clickout element': 'hide',
            'clickout nodes': 'hide',
            'swipe element': 'onSwipe',
            'keydown window': 'onKeydown'
        };

        events['click ' + options.delegate] = 'onShow';
        events['click ' + options.closeEvent] = 'hide';
        events['click ' + options.nextEvent] = 'next';
        events['click ' + options.prevEvent] = 'prev';
        events['click ' + options.jumpEvent] = 'onJump';

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Hide the showcase and reset inner elements.
     *
     * @returns {Toolkit.Showcase}
     */
    hide: function() {
        if (this.blackout) {
            this.blackout.hide();
        }

        if (this.options.stopScroll) {
            document.body.removeClass('no-scroll');
        }

        this.parent(function() {
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
     * @returns {Toolkit.Showcase}
     */
    jump: function(index) {
        index = Number.from(index).bound(this.data.length);

        var self = this,
            options = this.options,
            element = this.element,
            list = this.items,
            listItems = list.getElements('li'),
            listItem = listItems[index],
            items = this.data,
            item = items[index];

        // Save state
        this.index = index;

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
                self.position();
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
                    listItem.grab(new Element('div.' + Toolkit.vendor + 'showcase-caption').set('html', item.title));
                }

                // Reveal the image after animation
                setTimeout(function() {
                    element.removeClass('is-loading');
                    listItem.addClass('show').grab(img);
                    self.position();
                }, options.transition);
            };
        }

        this.fireEvent('jump', index);

        return this;
    },

    /**
     * Go to the next item.
     *
     * @returns {Toolkit.Showcase}
     */
    next: function() {
        this.jump(this.index + 1);

        return this;
    },

    /**
     * Position the element in the middle of the screen.
     *
     * @returns {Toolkit.Showcase}
     */
    position: function() {
        if (this.blackout) {
            this.blackout.hideLoader();
        }

        this.element.reveal();

        this.fireEvent('show');

        return this;
    },

    /**
     * Go to the previous item.
     *
     * @returns {Toolkit.Showcase}
     */
    prev: function() {
        this.jump(this.index - 1);

        return this;
    },

    /**
     * Reveal the showcase after scraping for items data.
     * Will scrape data from the activating node.
     * If a category exists, scrape data from multiple nodes.
     *
     * @param {Element} node
     * @returns {Toolkit.Showcase}
     */
    show: function(node) {
        this.node = node;
        this.index = 0;
        this.element.addClass('is-loading');

        var options = this.inheritOptions(this.options, node),
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

        if (this.blackout) {
            this.blackout.show();
        }

        if (options.stopScroll) {
            document.body.addClass('no-scroll');
        }

        this._buildItems(items);
        this.jump(index);

        return this;
    },

    /**
     * Build the list of items and tabs based on the generated data.
     * Determine which elements to show and bind based on the data.
     *
     * @private
     * @param {Array} items
     * @returns {Toolkit.Showcase}
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

        this.fireEvent('load', items);

        return this;
    }.protect(),

    /**
     * Resize the showcase modal when it is larger than the current viewport.
     *
     * @private
     * @param {Number} width
     * @param {Number} height
     * @return {Toolkit.Showcase}
     */
    _resize: function(width, height) {
        var size = window.getSize(),
            gutter = this.options.gutter,
            ratio, diff;

        if ((width + gutter) > size.x) {
            var newWidth = (size.x - (gutter * 2)); // leave edge gap

            ratio = (width / height);
            diff = (width - newWidth);
            width = newWidth;
            height -= Math.round(diff / ratio);

        } else if ((height + gutter) > size.y) {
            var newHeight = (size.y - (gutter * 2)); // leave edge gap

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
    onJump: function(e) {
        e.preventDefault();

        this.jump(e.target.get('data-index') || 0);
    },

    /**
     * Event handler for keyboard events.
     *
     * @private
     * @param {DOMEvent} e
     */
    onKeydown: function(e) {
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
    },

    /**
     * Event handler for swiping.
     *
     * @private
     * @param {DOMEvent} e
     */
    onSwipe: function(e) {
        if (e.direction === 'left') {
            this.next();
        } else if (e.direction === 'right') {
            this.prev();
        }
    }

});

    /**
     * Defines a component that can be instantiated through showcase().
     */
    Toolkit.create('showcase', function(options) {
        return new Toolkit.Showcase(this, options);
    }, true);

})();