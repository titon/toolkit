/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Carousel = new Class({
    Extends: Titon.Component,
    Binds: ['next', 'prev', 'start', 'stop', 'resize', '__cycle', '__jump'],

    /** Is the carousel stopped? */
    stopped: false,

    /** Items and parent container */
    itemsWrapper: null,
    items: [],

    /** Item dimensions */
    itemWidth: 0,
    itemHeight: 0,

    /** Tabs and parent container */
    tabsWrapper: null,
    tabs: [],

    /** Previous and next buttons */
    prevButton: null,
    nextButton: null,

    /** The current and previous shown indices */
    previousIndex: 0,
    currentIndex: 0,

    /** Cycle timer */
    timer: null,

    /** Default options */
    options: {
        animation: 'slide',
        duration: 5000,
        autoCycle: true,
        stopOnHover: true,
        itemsElement: '.carousel-items',
        itemElement: 'li',
        tabsElement: '.carousel-tabs',
        tabElement: 'a',
        nextElement: '.carousel-next',
        prevElement: '.carousel-prev',
        template: false,

        // Events
        onStart: null,
        onStop: null,
        onCycle: null,
        onJump: null
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.setElement(element);

        if (!this.element) {
            return;
        }

        options = this.options;

        // Get elements
        this.itemsWrapper = this.element.getElement(options.itemsElement);

        if (this.itemsWrapper) {
            this.items = this.itemsWrapper.getElements(options.itemElement);
        }

        this.tabsWrapper = this.element.getElement(options.tabsElement);

        if (this.tabsWrapper) {
            this.tabs = this.tabsWrapper.getElements(options.tabElement);
        }

        this.nextButton = this.element.getElement(options.nextElement);
        this.prevButton = this.element.getElement(options.prevElement);

        // Disable carousel if too low of items
        if (this.items.length <= 1) {
            this.tabsWrapper.hide();
            this.nextButton.hide();
            this.prevButton.hide();

            return;
        }

        // Set some sizes for responsiveness
        switch (options.animation) {
            case 'fade':
                this.items[0].reveal();
            break;
            case 'slide':
                this.itemsWrapper.setStyle('width', (this.items.length * 100) + '%');
                this.items.setStyle('width', (100 / this.items.length) + '%');
            break;
        }

        // Store some data in the elements
        this.tabs.forEach(function(tab, index) {
            tab.set('data-index', index);
        });

        // Set events
        window.addEvent('keydown', function(e) {
            if (['up', 'down', 'left', 'right'].contains(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case 'up':      this.jump(0); break;
                case 'down':    this.jump(-1); break;
                case 'left':    this.prev(); break;
                case 'right':   this.next(); break;
            }
        }.bind(this));

        window.addEvent('resize', this.resize);

        this.bindEvents();
        this.fireEvent('init');
    },

    /**
     * Set events for all element interaction.
     *
     * @returns {Titon.Carousel}
     */
    bindEvents: function() {
        if (!this.element) {
            return this;
        }

        if (this.options.stopOnHover) {
            this.element
                .addEvent('mouseenter', this.stop)
                .addEvent('mouseleave', this.start);
        }

        if (this.tabs.length) {
            this.tabs.addEvent('click', this.__jump);
        }

        if (this.nextButton) {
            this.nextButton.addEvent('click', this.next);
        }

        if (this.prevButton) {
            this.prevButton.addEvent('click', this.prev);
        }

        this.start().reset();

        return this;
    },

    /**
     * Go to the item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     * @returns {Titon.Carousel}
     */
    jump: function(index) {
        if (index >= this.items.length) {
            index = 0;
        } else if (index < 0) {
            index = this.items.length - 1;
        }

        // Save state
        this.previousIndex = this.currentIndex;
        this.currentIndex = index;

        // Update tabs
        if (this.tabs.length) {
            this.tabs.removeClass('is-active');

            if (this.tabs[index]) {
                this.tabs[index].addClass('is-active');
            }
        }

        // Animate!
        switch (this.options.animation) {
            case 'fade':
                // Don't use conceal() as it causes the animation to flicker
                this.items.removeClass('show');
                this.items[index].reveal();
            break;
            case 'slide-up':
                if (!this.itemHeight) {
                    this.resize();
                }

                // Animating top property doesn't work with percentages
                this.itemsWrapper.setStyle('top', -(index * this.itemHeight) + 'px');
            break;
            default:
                this.itemsWrapper.setStyle('left', -(index * 100) + '%');
            break;
        }

        this.reset();
        this.fireEvent('jump', index);

        return this;
    },

    /**
     * Go to the next item.
     *
     * @returns {Titon.Carousel}
     */
    next: function() {
        this.jump(this.currentIndex + 1);

        return this;
    },

    /**
     * Go to the previous item.
     *
     * @returns {Titon.Carousel}
     */
    prev: function() {
        this.jump(this.currentIndex - 1);

        return this;
    },

    /**
     * Reset the timer.
     *
     * @returns {Titon.Carousel}
     */
    reset: function() {
        if (this.options.autoCycle) {
            clearInterval(this.timer);
            this.timer = setInterval(this.__cycle, this.options.duration);
        }

        return this;
    },

    /**
     * Cache sizes once the carousel starts or when browser is resized.
     * We need to defer this to allow image loading.
     *
     * @returns {Titon.Carousel}
     */
    resize: function() {
        var size = this.items[0].measure(function() {
            return this.getSize();
        });

        this.itemWidth = size.x;
        this.itemHeight = size.y;

        // Set height since items are absolute positioned
        if (this.options.animation !== 'slide') {
            this.itemsWrapper.setStyle('height', size.y + 'px');
        }

        return this;
    },

    /**
     * Start the carousel.
     *
     * @returns {Titon.Carousel}
     */
    start: function() {
        this.element.removeClass('is-stopped');
        this.stopped = false;

        this.fireEvent('start');

        return this;
    },

    /**
     * Stop the carousel.
     *
     * @returns {Titon.Carousel}
     */
    stop: function() {
        this.element.addClass('is-stopped');
        this.stopped = true;

        this.fireEvent('stop');

        return this;
    },

    /**
     * Event handler for cycling between items.
     * Will stop cycling if carousel is stopped.
     *
     * @private
     */
    __cycle: function() {
        if (!this.enabled) {
            return;
        }

        if (!this.itemWidth || !this.itemHeight) {
            this.resize();
        }

        // Don't cycle if the carousel has stopped
        if (!this.stopped) {
            this.fireEvent('cycle');
            this.next();
        }
    },

    /**
     * Event handler for jumping between items.
     *
     * @private
     * @param {DOMEvent} e
     */
    __jump: function(e) {
        e.stop();

        if (!this.enabled) {
            return;
        }

        this.jump(e.target.get('data-index') || 0);
    }

});

/**
 * Allow the carousel to be created on elements by calling carousel().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('carousel-id').carousel({
 *         stopOnHover: true
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Carousel}
 */
Element.implement('carousel', function(options) {
    if (!this.$carousel) {
        this.$carousel = new Titon.Carousel(this, options);
    }

    return this;
});

})();