/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Showcase = Toolkit.Component.create(function(nodes, options) {
        this.component = 'Showcase';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Showcase.options, options);

        /** List of nodes to activate showcase */
        this.nodes = $(nodes);

        /** Showcase element */
        this.element = this.createElement(this.options);

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

        this.initialize();
    });

    Toolkit.Showcase.options = {
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
    };

    var Showcase = Toolkit.Showcase.prototype;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    Showcase.initialize = function() {
        // IE doesn't support animations
        if (!Toolkit.hasTransition) {
            this.options.transition = 1;
        }

        var options = this.options;

        // Get elements
        this.items = this.element.find(options.itemsElement);
        this.tabs = this.element.find(options.tabsElement);
        this.prevButton = this.element.find(options.prevElement);
        this.nextButton = this.element.find(options.nextElement);

        // Increase gutter
        options.gutter += (this.element.height() - this.items.height());

        // Blackout
        if (options.blackout) {
            this.blackout = Toolkit.Blackout.factory();
        }

        // Set events
        this.element.clickout(this.hide.bind(this));
        this.nodes.clickout(this.hide.bind(this));

        $(options.context || document)
            .on('click', this.nodes.selector, this.__show.bind(this));

        $(window).on('keydown', function(e) {
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
        }.bind(this));

        this.element
            .on('click', options.closeEvent, this.hide.bind(this))
            .on('click swipeleft', options.nextEvent, this.next.bind(this))
            .on('click swiperight', options.prevEvent, this.prev.bind(this))
            .on('click', options.jumpEvent, this.__jump.bind(this));

        this.fireEvent('init');
    };

    /**
     * Hide the showcase and reset inner elements.
     *
     * @returns {Toolkit.Showcase}
     */
    Showcase.hide = function() {
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
    };

    /**
     * Jump to a specific item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     * @returns {Toolkit.Showcase}
     */
    Showcase.jump = function(index) {
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
    };

    /**
     * Go to the next item.
     *
     * @returns {Toolkit.Showcase}
     */
    Showcase.next = function() {
        this.jump(this.currentIndex + 1);

        return this;
    };

    /**
     * Position the element in the middle of the screen.
     *
     * @returns {Toolkit.Showcase}
     */
    Showcase.position = function() {
        if (this.blackout) {
            this.blackout.hideLoader();
        }

        this.element.reveal();

        this.fireEvent('show');

        return this;
    };

    /**
     * Go to the previous item.
     *
     * @returns {Toolkit.Showcase}
     */
    Showcase.prev = function() {
        this.jump(this.currentIndex - 1);

        return this;
    };

    /**
     * Reveal the showcase after scraping for items data.
     * Will scrape data from the activating node.
     * If a category exists, scrape data from multiple nodes.
     *
     * @param {Element} node
     * @returns {Toolkit.Showcase}
     */
    Showcase.show = function(node) {
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
    };

    /**
     * Build the list of items and tabs based on the generated data.
     * Determine which elements to show and bind based on the data.
     *
     * @private
     * @param {Array} items
     * @returns {Toolkit.Showcase}
     */
    Showcase._buildItems = function(items) {
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
    };

    /**
     * Resize the showcase modal when it is larger than the current viewport.
     *
     * @private
     * @param {Number} width
     * @param {Number} height
     * @return {Toolkit.Showcase}
     */
    Showcase._resize = function(width, height) {
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
    };

    /**
     * Event handler for jumping between items.
     *
     * @private
     * @param {DOMEvent} e
     */
    Showcase.__jump = function(e) {
        e.preventDefault();

        this.jump($(e.target).data('index') || 0);
    };

    /**
     * Event handler for show().
     *
     * @private
     * @param {Event} e
     */
    Showcase.__show = function(e) {
        e.preventDefault();

        this.show(e.currentTarget);
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
     * @returns {jQuery}
     */
    $.fn.showcase = function(options) {
        var showcase = new Toolkit.Showcase(this, options);

        return this.each(function() {
            $(this).addData('toolkit.showcase', showcase);
        });
    };

})(jQuery);