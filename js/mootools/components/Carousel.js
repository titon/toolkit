/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Carousel = new Class({
    Extends: Toolkit.Component,
    Binds: ['next', 'prev', 'start', 'stop', 'resize', 'onCycle', 'onJump'],

    /** Is the carousel stopped? */
    stopped: false,

    /** Items and parent container */
    itemsWrapper: null,
    itemsList: null,
    items: [],

    /** Tabs and parent container */
    tabsWrapper: null,
    tabs: [],

    /** Previous and next buttons */
    prevButton: null,
    nextButton: null,

    /** The current index */
    index: 0,

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
        template: false
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.element = element;
        this.options = options = this.inheritOptions(this.options, element);

        // Get elements
        this.itemsWrapper = element.getElement(options.itemsElement);

        if (this.itemsWrapper) {
            this.itemsList = this.itemsWrapper.getChildren('ul, ol');
            this.items = this.itemsWrapper.getElements(options.itemElement);
        }

        this.tabsWrapper = element.getElement(options.tabsElement);

        if (this.tabsWrapper) {
            this.tabs = this.tabsWrapper.getElements(options.tabElement);
        }

        this.nextButton = element.getElement(options.nextElement);
        this.prevButton = element.getElement(options.prevElement);

        // Disable carousel if too low of items
        if (this.items.length <= 1) {
            this.tabsWrapper.hide();
            this.nextButton.hide();
            this.prevButton.hide();

            return;
        }

        element.addClass(options.animation);

        // Set some sizes for responsiveness
        switch (options.animation) {
            case 'fade':
                this.items[0].reveal();
            break;
            case 'slide':
                this.itemsList.setStyle('width', (this.items.length * 100) + '%');
                this.items.setStyle('width', (100 / this.items.length) + '%');
            break;
        }

        // Store some data in the elements
        this.tabs.forEach(function(tab, index) {
            tab.set('data-index', index);
        });

        // Set events
        this.events = {
            'keydown window': 'onKeydown',
            'swipe element': 'onSwipe',
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

        this.reset().start();
    },

    /**
     * Go to the item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     * @returns {Toolkit.Carousel}
     */
    jump: function(index) {
        this.index = index = Number.from(index).bound(this.items.length);

        // Update tabs
        if (this.tabs.length) {
            this.tabs.removeClass(Toolkit.options.isPrefix + 'active');

            if (this.tabs[index]) {
                this.tabs[index].addClass(Toolkit.options.isPrefix + 'active');
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
                this.itemsList.setStyle('top', -(index * 100) + '%');
            break;
            default:
                this.itemsList.setStyle('left', -(index * 100) + '%');
            break;
        }

        this.reset();
        this.fireEvent('jump', index);

        return this;
    },

    /**
     * Go to the next item.
     *
     * @returns {Toolkit.Carousel}
     */
    next: function() {
        this.jump(this.index + 1);

        return this;
    },

    /**
     * Go to the previous item.
     *
     * @returns {Toolkit.Carousel}
     */
    prev: function() {
        this.jump(this.index - 1);

        return this;
    },

    /**
     * Reset the timer.
     *
     * @returns {Toolkit.Carousel}
     */
    reset: function() {
        if (this.options.autoCycle) {
            clearInterval(this.timer);
            this.timer = setInterval(this.onCycle, this.options.duration);
        }

        return this;
    },

    /**
     * Start the carousel.
     *
     * @returns {Toolkit.Carousel}
     */
    start: function() {
        this.element.removeClass(Toolkit.options.isPrefix + 'stopped');
        this.stopped = false;

        this.fireEvent('start');

        return this;
    },

    /**
     * Stop the carousel.
     *
     * @returns {Toolkit.Carousel}
     */
    stop: function() {
        this.element.addClass(Toolkit.options.isPrefix + 'stopped');
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
     * @param {DOMEvent} e
     */
    onJump: function(e) {
        e.preventDefault();

        this.jump(e.target.get('data-index') || 0);
    },

    /**
     * Event handle for keyboard events.
     *
     * @private
     * @param {DOMEvent} e
     */
    onKeydown: function(e) {
        if (['up', 'down', 'left', 'right'].contains(e.key)) {
            e.preventDefault();
        } else {
            return;
        }

        switch (e.key) {
            case 'up':      this.jump(0); break;
            case 'down':    this.jump(-1); break;
            case 'left':    this.prev(); break;
            case 'right':   this.next(); break;
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
     * Defines a component that can be instantiated through carousel().
     */
    Toolkit.createComponent('carousel', function(options) {
        return new Toolkit.Carousel(this, options);
    });

})();