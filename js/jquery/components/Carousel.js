/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Carousel = Toolkit.Component.extend(function(element, options) {
        this.component = 'Carousel';
        this.version = '1.0.0';
        this.options = options = this.setOptions(options);
        this.element = element = this.setElement(element);
        this.itemsWrapper = element.find(options.itemsElement);
        this.itemsList = this.itemsWrapper.children('ul, ol');
        this.items = this.itemsWrapper.find(options.itemElement);
        this.tabsWrapper = element.find(options.tabsElement);
        this.tabs = this.tabsWrapper.find(options.tabElement);
        this.nextButton = element.find(options.nextElement);
        this.prevButton = element.find(options.prevElement);
        this.index = 0;
        this.timer = null;
        this.stopped = false;

        // Disable carousel if too low of items
        if (this.items.length <= 1) {
            this.tabsWrapper.hide();
            this.nextButton.hide();
            this.prevButton.hide();

            return;
        }

        // Set sizes for responsiveness
        switch (options.animation) {
            case 'fade':
                this.items.item(0).reveal();
            break;
            case 'slide':
                this.itemsList.css('width', (this.items.length * 100) + '%');
                this.items.css('width', (100 / this.items.length) + '%');
            break;
        }

        // Cache the index of tabs
        this.tabs.each(function(index) {
            $(this).data('index', index);
        });

        // Initialize events
        this.events = {
            'keydown window': 'onKeydown',
            'swipeleft element': 'next',
            'swipeup element': 'next',
            'swiperight element': 'prev',
            'swipdown element': 'prev',
            'click tabs': 'onJump',
            'click nextButton': 'next',
            'click prevButton': 'prev'
        };

        if (options.stopOnHover) {
            this.events['mouseenter element'] = 'stop';
            this.events['mouseleave element'] = 'start';
        }

        this.enable();
        this.fireEvent('init');

        // Start the carousel
        this.reset();
        this.start();
    }, {

        /**
         * Go to the item indicated by the index number.
         * If the index is too large, jump to the beginning.
         * If the index is too small, jump to the end.
         *
         * @param {Number} index
         */
        jump: function(index) {
            if (index >= this.items.length) {
                index = 0;
            } else if (index < 0) {
                index = this.items.length - 1;
            }

            // Save state
            this.index = index;

            // Update tabs
            if (this.tabs.length) {
                this.tabs
                    .removeClass(Toolkit.options.isPrefix + 'active')
                    .item(index).addClass(Toolkit.options.isPrefix + 'active');
            }

            // Animate!
            switch (this.options.animation) {
                case 'fade':
                    // Don't use conceal() as it causes the animation to flicker
                    this.items
                        .removeClass('show')
                        .item(index).reveal();
                break;
                case 'slide-up':
                    this.itemsList.css('top', -(index * 100) + '%');
                break;
                default:
                    this.itemsList.css('left', -(index * 100) + '%');
                break;
            }

            this.reset();
            this.fireEvent('jump', index);
        },

        /**
         * Go to the next item.
         */
        next: function() {
            this.jump(this.index + 1);
        },

        /**
         * Go to the previous item.
         */
        prev: function() {
            this.jump(this.index - 1);
        },

        /**
         * Reset the timer.
         */
        reset: function() {
            if (this.options.autoCycle) {
                clearInterval(this.timer);
                this.timer = setInterval(this.onCycle.bind(this), this.options.duration);
            }
        },

        /**
         * Start the carousel.
         */
        start: function() {
            this.element.removeClass(Toolkit.options.isPrefix + 'stopped');
            this.stopped = false;

            this.fireEvent('start');
        },

        /**
         * Stop the carousel.
         */
        stop: function() {
            this.element.addClass(Toolkit.options.isPrefix + 'stopped');
            this.stopped = true;

            this.fireEvent('stop');
        },

        /**
         * Event handler for cycling between items.
         * Will stop cycling if carousel is stopped.
         *
         * @private
         */
        onCycle: function() {
            if (!this.stopped) {
                this.fireEvent('cycle', this.index);
                this.next();
            }
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
            if ($.inArray(e.keyCode, [37, 38, 39, 40]) >= 0) {
                e.preventDefault();
            } else {
                return;
            }

            switch (e.keyCode) {
                case 37: this.prev(); break;
                case 38: this.jump(0); break;
                case 39: this.next(); break;
                case 40: this.jump(-1); break;
            }
        }

    }, {
        animation: 'slide',
        duration: 5000,
        autoCycle: true,
        stopOnHover: true,
        itemsElement: '.carousel-items',
        itemElement: 'li',
        tabsElement: '.carousel-tabs',
        tabElement: 'a',
        nextElement: '.carousel-next',
        prevElement: '.carousel-prev'
    });

    /**
     * Defines a component that can be instantiated through carousel().
     */
    Toolkit.createComponent('carousel', function(options) {
        return new Toolkit.Carousel(this, options);
    });

})(jQuery);