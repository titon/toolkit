/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Showcase = new Class({
    Extends: Toolkit.Component,
    Binds: ['next', 'prev', 'onJump', 'onSwipe', 'onKeydown'],

    /** Items elements */
    items: null,

    /** Tabs elements */
    tabs: null,

    /** Caption element */
    caption: null,

    /** List of items data to populate the showcase with **/
    data: [],

    /** The current index */
    index: -1,

    /** Blackout instance if options.blackout is true */
    blackout: null,

    /** Default options */
    options: {
        delegate: '.js-showcase',
        blackout: true,
        stopScroll: true,
        gutter: 50,
        getCategory: 'data-showcase',
        getImage: 'href',
        getTitle: 'title',
        template: '<div class="showcase">' +
            '<div class="showcase-inner">' +
                '<ul class="showcase-items"></ul>' +
                '<ol class="showcase-tabs bullets"></ol>' +
                '<button class="showcase-prev"><span class="arrow-left"></span></button>' +
                '<button class="showcase-next"><span class="arrow-right"></span></button>' +
            '</div>' +
            '<button class="showcase-close showcase-hide"><span class="x"></span></button>' +
            '<div class="showcase-caption"></div>' +
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

        // Get elements
        this.items = this.element.getElement('.' + vendor + 'showcase-items');
        this.tabs = this.element.getElement('.' + vendor + 'showcase-tabs');
        this.caption = this.element.getElement('.' + vendor + 'showcase-caption');

        // Blackout
        if (this.options.blackout) {
            this.blackout = Toolkit.Blackout.factory();
        }

        this.events = {
            'clickout element': 'onHide',
            'clickout document {selector}': 'onHide',
            'swipe element': 'onSwipe',
            'keydown window': 'onKeydown',
            'click document {selector}': 'onShow',
            'click element .@showcase-hide': 'onHide',
            'click element .@showcase-next': 'next',
            'click element .@showcase-prev': 'prev',
            'click element .@showcase-tabs a': 'onJump'
        };

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
                .getElements('li')
                    .conceal();
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

        // Exit since transitions dont occur
        if (index === this.index) {
            return this;
        }

        var self = this,
            element = this.element,
            caption = this.caption,
            list = this.items,
            listItems = list.getElements('li'),
            listItem = listItems[index],
            items = this.data,
            item = items[index];

        // Update tabs
        if (this.tabs) {
            var listTabs = this.tabs.getElements('a');

            listTabs.removeClass('is-active');
            listTabs[index].addClass('is-active');
        }

        // Fade out previous item
        listItems.conceal();
        caption.conceal();

        // Disable bubbling of transitionend
        listItems.addEvent(Toolkit.transitionEnd, function(e) {
            e.stopPropagation();
        });

        // Reveal the image after the transition ends
        var callback = function() {
            caption.set('html', item.title).reveal();
            listItem.reveal();
            self.position();
        };

        list.addEvent(Toolkit.transitionEnd + ':once', callback);

        // Image already exists
        if (listItem.hasAttribute('data-width')) {
            this._resize(listItem.get('data-width').toInt(), listItem.get('data-height').toInt());

            // IE9
            if (!Toolkit.hasTransition) {
                callback();
            }

        // Create image and animate
        } else {
            element
                .addClass('is-loading')
                .aria('busy', true);

            // Preload image
            var img = new Image();
                img.src = item.image;

            // Render frame when image load
            img.onload = function() {
                self._resize(this.width, this.height); // Must be called 1st or FF fails

                element
                    .removeClass('is-loading')
                    .aria('busy', false);

                listItem
                    .set('data-width', this.width)
                    .set('data-height', this.height)
                    .grab(img);

                // IE9
                if (!Toolkit.hasTransition) {
                    callback();
                }
            };

            // Display error message if load fails
            img.onerror = function() {
                element
                    .removeClass('is-loading')
                    .addClass('has-failed')
                    .aria('busy', false);

                listItem
                    .set('data-width', 150)
                    .set('data-height', 150)
                    .set('html', Toolkit.messages.error);

                self._resize(150, 150);

                // IE9
                if (!Toolkit.hasTransition) {
                    callback();
                }
            };
        }

        // Save state
        this.index = index;

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
        this.index = -1;
        this.element
            .addClass('is-loading')
            .aria('busy', true);

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
            gutter = (this.options.gutter * 2),
            wWidth = size.x - gutter,
            wHeight = size.y - gutter,
            ratio,
            diff;

        if (width > wWidth) {
            ratio = (width / height);
            diff = (width - wWidth);

            width = wWidth;
            height -= Math.round(diff / ratio);

        } else if (height > wHeight) {
            ratio = (height / width);
            diff = (height - wHeight);

            width -= Math.round(diff / ratio);
            height = wHeight;
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

Toolkit.create('showcase', function(options) {
    return new Toolkit.Showcase(this, options);
}, true);
