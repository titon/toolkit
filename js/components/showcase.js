/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './template-component',
    './blackout',
    '../events/clickout',
    '../events/swipe',
    '../extensions/bound',
    '../extensions/shown-selector',
    '../extensions/transitionend'
], function($, Toolkit, TemplateComponent, Blackout) {

var Showcase = Toolkit.Showcase = TemplateComponent.extend({
    name: 'Showcase',
    version: '2.1.0',

    /** Is the showcase currently animating? */
    animating: false,

    /** Blackout instance if enabled. */
    blackout: null,

    /** The caption element. */
    caption: null,

    /** Items gathered when node is activated. */
    data: [],

    /** Current index of the item being shown. */
    index: -1,

    /** The wrapping items element. */
    items: [],

    /** The wrapping tabs element. */
    tabs: [],

    /**
     * Initialize the showcase.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        var element;

        options = this.setOptions(options);
        this.element = element = this.createElement();

        // Nodes found in the page on initialization
        this.nodes = $(nodes);

        // The wrapping items element
        this.items = element.find(this.ns('items'));

        // The wrapping tabs element
        this.tabs = element.find(this.ns('tabs'));

        // The caption element
        this.caption = element.find(this.ns('caption'));

        // Blackout element if enabled
        if (options.blackout) {
            this.blackout = Blackout.instance();
        }

        // Initialize events
        this.addEvents([
            ['keydown', 'window', 'onKeydown'],
            ['click', 'document', 'onShow', '{selector}'],
            ['click', 'element', 'hide', this.ns('close')],
            ['click', 'element', 'next', this.ns('next')],
            ['click', 'element', 'prev', this.ns('prev')],
            ['click', 'element', 'onJump', this.ns('tabs') + ' a']
        ]);

        if (options.clickout) {
            this.addEvents([
                ['clickout', 'document', 'onHide', '{selector}'],
                ['clickout', 'element', 'onHide']
            ]);
        }

        if (options.swipe) {
            this.addEvents([
                ['swipeleft', 'element', 'next'],
                ['swiperight', 'element', 'prev']
            ]);
        }

        // Stop `transitionend` events from bubbling up when the showcase is resized
        this.addEvent(Toolkit.transitionEnd, 'element', function(e) {
            e.stopPropagation();
        }, this.ns('items'));

        this.initialize();
    },

    /**
     * Hide the showcase and reset inner elements.
     */
    hide: function() {
        this.fireEvent('hiding');

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
                .conceal(true);

        this.fireEvent('hidden');
    },

    /**
     * Jump to a specific item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     */
    jump: function(index) {
        if (this.animating) {
            return;
        }

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
            item = items[index],
            deferred = $.Deferred();

        this.fireEvent('jumping', [this.index]);

        // Update tabs
        this.tabs.find('a')
            .removeClass('is-active')
            .eq(index)
                .addClass('is-active');

        // Reset previous styles
        listItems.conceal(true);
        caption.conceal(true);
        element
            .addClass('is-loading')
            .aria('busy', true)
            .reveal();

        // Setup deferred callbacks
        this.animating = true;

        deferred.always(function(width, height) {
            list.transitionend(function() {
                caption.html(item.title).reveal(true);
                listItem.reveal(true);
                self.position();
                self.animating = false;
            });

            self._resize(width, height);

            element
                .removeClass('is-loading')
                .aria('busy', false);

            listItem
                .data('width', width)
                .data('height', height);
        });

        deferred.fail(function() {
            element.addClass('has-failed');
            listItem.html(Toolkit.messages.error);
        });

        // Image already exists
        if (listItem.data('width')) {
            deferred.resolve(listItem.data('width'), listItem.data('height'));

        // Create image and animate
        } else {
            var img = new Image();
                img.src = item.image;
                img.onerror = function() {
                    deferred.reject(150, 150);
                };
                img.onload = function() {
                    deferred.resolve(this.width, this.height);
                    listItem.append(img);
                };
        }

        // Hide loader
        if (this.blackout) {
            this.blackout.hideLoader();
        }

        // Save state
        this.index = index;

        this.fireEvent('jumped', [index]);
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
        this.fireEvent('showing');

        if (this.blackout) {
            this.blackout.hideLoader();
        }

        this.element.reveal();

        this.fireEvent('shown');
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

        var options = this.inheritOptions(this.options, node),
            read = this.readValue,
            category = read(node, options.getCategory),
            items = [],
            index = 0;

        // Multiple items based on category
        if (category) {
            for (var i = 0, x = 0, n; n = this.nodes[i]; i++) {
                if (read(n, options.getCategory) === category) {
                    if (node.is(n)) {
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
                .data('showcase-index', i);

            li = $('<li/>');
            li.appendTo(this.tabs).append(a);
        }

        if (items.length <= 1) {
            this.element.addClass('is-single');
        }

        this.fireEvent('load', [items]);
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

        // Resize if the width is larger
        if (width > wWidth) {
            ratio = (width / height);
            diff = (width - wWidth);

            width = wWidth;
            height -= Math.round(diff / ratio);
        }

        // Resize again if the height is larger
        if (height > wHeight) {
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

        this.jump($(e.target).data('showcase-index') || 0);
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
    }

}, {
    blackout: true,
    stopScroll: true,
    clickout: true,
    swipe: Toolkit.isTouch,
    gutter: 50,
    getCategory: 'data-showcase',
    getImage: 'href',
    getTitle: 'title',
    template: function(bem) {
        return '<div class="' + bem('showcase') + '">' +
            '<div class="' + bem('showcase', 'inner') + '">' +
                '<ul class="' + bem('showcase', 'items') + '" data-showcase-items></ul>' +
                '<ol class="' + bem('showcase', 'tabs') + ' bullets" data-showcase-tabs></ol>' +
                '<button class="' + bem('showcase', 'prev') + '" data-showcase-prev></button>' +
                '<button class="' + bem('showcase', 'next') + '" data-showcase-next></button>' +
            '</div>' +
            '<button class="' + bem('showcase', 'close') + '" data-showcase-close><span class="x"></span></button>' +
            '<div class="' + bem('showcase', 'caption') + '" data-showcase-caption></div>' +
        '</div>';
    }
});

Toolkit.createPlugin('showcase', function(options) {
    return new Showcase(this, options);
}, true);

return Showcase;
});
