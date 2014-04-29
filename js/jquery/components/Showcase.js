/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Showcase = Toolkit.Component.extend(function(nodes, options) {
    var element;

    this.component = 'Showcase';
    this.version = '1.4.0';
    this.options = options = this.setOptions(options);
    this.element = element = this.createElement();

    // Nodes found in the page on initialization
    this.nodes = $(nodes);

    // The wrapping items element
    this.items = element.find('.' + vendor + 'showcase-items');

    // The wrapping tabs element
    this.tabs = element.find('.' + vendor + 'showcase-tabs');

    // The caption element
    this.caption = element.find('.' + vendor + 'showcase-caption');

    // Items gathered when node was activated
    this.data = [];

    // Current index of the item being shown
    this.index = -1;

    // Blackout element if enabled
    this.blackout = options.blackout ? Toolkit.Blackout.factory() : null;

    // Initialize events
    this.events = {
        'clickout element': 'onHide',
        'clickout document {selector}': 'onHide',
        'swipeleft element': 'next',
        'swipeup element': 'next',
        'swiperight element': 'prev',
        'swipedown element': 'prev',
        'keydown window': 'onKeydown',
        'click document {selector}': 'onShow',
        'click element .@showcase-hide': 'onHide',
        'click element .@showcase-next': 'next',
        'click element .@showcase-prev': 'prev',
        'click element .@showcase-tabs a': 'onJump'
    };

    this.initialize();
}, {

    /**
     * Hide the showcase and reset inner elements.
     */
    hide: function() {
        if (this.blackout) {
            this.blackout.hide();
        }

        if (this.options.stopScroll) {
            $('body').removeClass('no-scroll');
        }

        this.element
            .conceal()
            .removeClass('is-single');

        this.items
            .removeAttr('style')
            .children('li')
                .conceal();

        this.fireEvent('hide');
    },

    /**
     * Jump to a specific item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     */
    jump: function(index) {
        index = $.bound(index, this.data.length);

        // Exit since transitions don't occur
        if (index === this.index) {
            return;
        }

        var self = this,
            element = this.element,
            caption = this.caption,
            list = this.items,
            listItems = list.children('li'),
            listItem = listItems.eq(index),
            items = this.data,
            item = items[index];

        // Update tabs
        this.tabs.find('a')
            .removeClass('is-active')
            .eq(index)
                .addClass('is-active');

        // Reset previous styles
        listItems.conceal();
        caption.conceal();

        // Disable bubbling of transitionend
        listItems.on(Toolkit.transitionEnd, function(e) {
            e.stopPropagation();
        });

        // Reveal the image after the transition ends
        var callback = function() {
            caption.html(item.title).reveal();
            listItem.reveal();
            self.position();
        };

        list.one(Toolkit.transitionEnd, callback);

        // Image already exists
        if (listItem.data('width')) {
            this._resize(listItem.data('width'), listItem.data('height'));

            // IE9
            if (!Toolkit.hasTransition) {
                callback();
            }

        // Create image and animate
        } else {
            element
                .addClass('is-loading')
                .aria('busy', true);

            var img = new Image();
                img.src = item.image;

            // Render frame when image load
            img.onload = function() {
                self._resize(this.width, this.height); // Must be called 1st or FF fails

                element
                    .removeClass('is-loading')
                    .aria('busy', false);

                listItem
                    .data('width', this.width)
                    .data('height', this.height)
                    .append(img);

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
                    .data('width', 150)
                    .data('height', 150)
                    .html(Toolkit.messages.error);

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
    },

    /**
     * Go to the next item.
     */
    next: function() {
        this.jump(this.index + 1);
    },

    /**
     * Position the element in the middle of the screen.
     */
    position: function() {
        if (this.blackout) {
            this.blackout.hideLoader();
        }

        this.element.reveal();

        this.fireEvent('show');
    },

    /**
     * Go to the previous item.
     */
    prev: function() {
        this.jump(this.index - 1);
    },

    /**
     * Reveal the showcase after scraping for items data.
     * Will scrape data from the activating node.
     * If a category exists, scrape data from multiple nodes.
     *
     * @param {Element} node
     */
    show: function(node) {
        this.node = node = $(node);
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
            $('body').addClass('no-scroll');
        }

        this._buildItems(items);
        this.jump(index);
    },

    /**
     * Build the list of items and tabs based on the generated data.
     * Determine which elements to show and bind based on the data.
     *
     * @private
     * @param {Array} items
     */
    _buildItems: function(items) {
        this.data = items;
        this.items.empty();
        this.tabs.empty();

        for (var li, a, item, i = 0; item = items[i]; i++) {
            li = $('<li/>');
            li.appendTo(this.items);

            a = $('<a/>')
                .attr('href', 'javascript:;')
                .data('index', i);

            li = $('<li/>');
            li.appendTo(this.tabs).append(a);
        }

        if (items.length <= 1) {
            this.element.addClass('is-single');
        }

        this.fireEvent('load', items);
    },

    /**
     * Resize the showcase modal when it is larger than the current viewport.
     *
     * @private
     * @param {Number} width
     * @param {Number} height
     */
    _resize: function(width, height) {
        var gutter = (this.options.gutter * 2),
            wWidth = $(window).width() - gutter,
            wHeight = $(window).height() - gutter,
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

        this.items.css({
            width: width,
            height: height
        });
    },

    /**
     * Event handler for hide().
     *
     * @private
     * @param {jQuery.Event} e
     */
    onHide: function(e) {
        e.preventDefault();

        var element = this.element;

        // If the showcase is loading (AJAX) or is not shown, exit early
        // This stops cases where the blackout can be clicked early
        if (!element.is(':shown') || element.hasClass('is-loading')) {
            return;
        }

        this.hide();
    },

    /**
     * Event handler for jumping between items.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onJump: function(e) {
        e.preventDefault();

        this.jump($(e.target).data('index') || 0);
    },

    /**
     * Event handle for keyboard events.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onKeydown: function(e) {
        if (this.element.is(':shown')) {
            if ($.inArray(e.keyCode, [37, 38, 39, 40]) >= 0) {
                e.preventDefault();
            }

            switch (e.keyCode) {
                case 27: this.hide(); break;
                case 37: this.prev(); break;
                case 38: this.jump(0); break;
                case 39: this.next(); break;
                case 40: this.jump(-1); break;
            }
        }
    },

    /**
     * Event handler for show().
     *
     * @private
     * @param {jQuery.Event} e
     */
    onShow: function(e) {
        e.preventDefault();

        this.show(e.currentTarget);
    }

}, {
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
});

Toolkit.create('showcase', function(options) {
    return new Toolkit.Showcase(this, options);
}, true);