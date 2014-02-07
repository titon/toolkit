/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Showcase = Toolkit.Component.create(function(nodes, options) {
        var element;

        this.component = 'Showcase';
        this.version = '0.0.0';

        // Set options and element
        this.options = options = this.setOptions(options);
        this.element = element = this.createElement();

        // IE doesn't support animations
        if (!Toolkit.hasTransition) {
            options.transition = 1;
        }

        // List of nodes to activate showcase
        this.nodes = nodes = $(nodes);

        // List elements
        this.items = element.find(options.itemsElement);
        this.tabs = element.find(options.tabsElement);

        options.gutter += (element.height() - this.items.height());

        // Previous and next buttons
        this.prevButton = element.find(options.prevElement);
        this.nextButton = element.find(options.nextElement);

        // List of items data to populate the showcase with
        this.data = [];

        // The current and previous shown indices
        this.previousIndex = 0;
        this.currentIndex = 0;

        // Blackout instance if options.blackout is true
        this.blackout = options.blackout ? Toolkit.Blackout.factory() : null;

        // Set events
        element.clickout(this.hide.bind(this));
        nodes.clickout(this.hide.bind(this));

        $(options.context || document)
            .on('click', nodes.selector, this.__show.bind(this));

        $(window).on('keydown', function(e) {
            if (element.is(':shown')) {
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
        }.bind(this));

        element
            .on('click', options.closeEvent, this.hide.bind(this))
            .on('click swipeleft', options.nextEvent, this.next.bind(this))
            .on('click swiperight', options.prevEvent, this.prev.bind(this))
            .on('click', options.jumpEvent, this.__jump.bind(this));

        this.fireEvent('init');
    }, {

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
                $('body').css('overflow', '');
            }

            if (this.element.is(':shown')) {
                this.element.conceal();
                this.element.removeClass(Toolkit.options.isPrefix + 'single');

                this.items
                    .removeAttr('style')
                    .children('li').removeClass('show');

                this.fireEvent('hide');
            }

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
            if (index >= this.data.length) {
                index = 0;
            } else if (index < 0) {
                index = this.data.length - 1;
            }

            var self = this,
                options = this.options,
                element = this.element,
                list = this.items,
                listItems = list.children('li'),
                listItem = listItems.item(index),
                items = this.data,
                item = items[index];

            // Save state
            this.previousIndex = this.currentIndex;
            this.currentIndex = index;

            // Update tabs
            if (this.tabs) {
                var listTabs = this.tabs.find('a');

                listTabs
                    .removeClass(Toolkit.options.isPrefix + 'active')
                    .item(index).addClass(Toolkit.options.isPrefix + 'active');
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
                element.addClass(Toolkit.options.isPrefix + 'loading');

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
                        listItem.append($('<div/>').addClass(Toolkit.options.vendor + 'showcase-caption').html(item.title));
                    }

                    // Reveal the image after animation
                    setTimeout(function() {
                        element.removeClass(Toolkit.options.isPrefix + 'loading');
                        listItem.addClass('show').append(img);
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
            this.jump(this.currentIndex + 1);

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
            this.jump(this.currentIndex - 1);

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
            this.node = node = $(node);
            this.currentIndex = this.previousIndex = 0;
            this.element.addClass(Toolkit.options.isPrefix + 'loading');

            var options = this.options,
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
                $('body').css('overflow', 'hidden');
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
                this.element.addClass(Toolkit.options.isPrefix + 'single');
            }

            this.fireEvent('load', items);

            return this;
        },

        /**
         * Resize the showcase modal when it is larger than the current viewport.
         *
         * @private
         * @param {Number} width
         * @param {Number} height
         * @return {Toolkit.Showcase}
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

            return this;
        },

        /**
         * Event handler for jumping between items.
         *
         * @private
         * @param {DOMEvent} e
         */
        __jump: function(e) {
            e.preventDefault();

            this.jump($(e.target).data('index') || 0);
        },

        /**
         * Event handler for show().
         *
         * @private
         * @param {Event} e
         */
        __show: function(e) {
            e.preventDefault();

            this.show(e.currentTarget);
        }

    }, {
        className: '',
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
                '<a href="javascript:;" class="showcase-prev showcase-event-prev"><span class="arrow-left"></span></a>' +
                '<a href="javascript:;" class="showcase-next showcase-event-next"><span class="arrow-right"></span></a>' +
                '<a href="javascript:;" class="showcase-close showcase-event-close"><span class="x"></span></a>' +
            '</div>' +
        '</div>'
    });

    /**
     * Defines a component that can be instantiated through showcase().
     */
    Toolkit.createComponent('showcase', function(options) {
        return new Toolkit.Showcase(this, options);
    }, true);

})(jQuery);