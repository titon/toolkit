/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Showcase = Toolkit.Component.extend(function(nodes, options) {
    var element, events;

    // IE doesn't support animations
    if (!Toolkit.hasTransition) {
        options.transition = 1;
    }

    this.component = 'Showcase';
    this.version = '1.2.2';
    this.options = options = this.setOptions(options);
    this.element = element = this.createElement();
    this.nodes = nodes = $(nodes);
    this.items = element.find(options.itemsElement);
    this.tabs = element.find(options.tabsElement);
    this.prevButton = element.find(options.prevElement);
    this.nextButton = element.find(options.nextElement);
    this.data = [];
    this.index = 0;
    this.blackout = options.blackout ? Toolkit.Blackout.factory() : null;

    // Increase gutter based on padding
    options.gutter += (element.height() - this.items.height());

    // Initialize events
    this.events = events = {
        'clickout element': 'onHide',
        'swipeleft element': 'next',
        'swipeup element': 'next',
        'swiperight element': 'prev',
        'swipedown element': 'prev',
        'keydown window': 'onKeydown'
    };

    events['clickout ' + nodes.selector] = 'onHide';
    events['click ' + nodes.selector] = 'onShow';
    events['click ' + options.closeEvent] = 'hide';
    events['click ' + options.nextEvent] = 'next';
    events['click ' + options.prevEvent] = 'prev';
    events['click ' + options.jumpEvent] = 'onJump';

    this.enable();
    this.fireEvent('init');
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
            .children('li').removeClass('show');

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

        var self = this,
            options = this.options,
            element = this.element,
            list = this.items,
            listItems = list.children('li'),
            listItem = listItems.item(index),
            items = this.data,
            item = items[index];

        // Save state
        this.index = index;

        // Update tabs
        if (this.tabs) {
            var listTabs = this.tabs.find('a');

            listTabs
                .removeClass('is-active')
                .item(index).addClass('is-active');
        }

        // Fade out previous item
        listItems.removeClass('show');

        // Image already exists
        if (listItem.data('width')) {

            // Resize the showcase to the image size
            this._resize(listItem.data('width'), listItem.data('height'));

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
                    .data('width', this.width)
                    .data('height', this.height);

                // Create the caption
                if (item.title) {
                    listItem.append($('<div/>').addClass(Toolkit.vendor + 'showcase-caption').html(item.title));
                }

                // Reveal the image after animation
                setTimeout(function() {
                    element.removeClass('is-loading');
                    listItem.addClass('show').append(img);
                    self.position();
                }, options.transition);
            };
        }

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
        this.index = 0;
        this.element.addClass('is-loading');

        var options = this.inheritOptions(this.options, node),
            read = this.readValue.bind(this),
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
                .addClass(this.options.jumpEvent.substr(1))
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
        var wWidth = $(window).width(),
            wHeight = $(window).height(),
            gutter = this.options.gutter,
            ratio, diff;

        if ((width + gutter) > wWidth) {
            var newWidth = (wWidth - (gutter * 2)); // leave edge gap

            ratio = (width / height);
            diff = (width - newWidth);
            width = newWidth;
            height -= Math.round(diff / ratio);

        } else if ((height + gutter) > wHeight) {
            var newHeight = (wHeight - (gutter * 2)); // leave edge gap

            ratio = (height / width);
            diff = (height - newHeight);

            width -= Math.round(diff / ratio);
            height = newHeight;
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

        this.jump($(e.currentTarget).data('index') || 0);
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
});

/**
 * Defines a component that can be instantiated through showcase().
 */
Toolkit.create('showcase', function(options) {
    return new Toolkit.Showcase(this, options);
}, true);