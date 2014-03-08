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
        this.setElement(element);

        if (!this.element) {
            return;
        }

        options = this.options;

        // Get elements
        this.itemsWrapper = this.element.getElement(options.itemsElement);

        if (this.itemsWrapper) {
            this.itemsList = this.itemsWrapper.getChildren('ul, ol');
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
                this.itemsList.setStyle('width', (this.items.length * 100) + '%');
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

        this.bindEvents();
        this.fireEvent('init');

        this.start().reset();
    },

    /**
     * Set events for all element interaction.
     *
     * @returns {Toolkit.Carousel}
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

        this.element
            .addEvent('swipe', function(e) {
                if (e.direction === 'left') {
                    this.next();
                } else if (e.direction === 'right') {
                    this.prev();
                }
            }.bind(this));

        if (this.tabs.length) {
            this.tabs.addEvent('click', this.onJump);
        }

        if (this.nextButton) {
            this.nextButton.addEvent('click', this.next);
        }

        if (this.prevButton) {
            this.prevButton.addEvent('click', this.prev);
        }

        return this;
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
        if (index >= this.items.length) {
            index = 0;
        } else if (index < 0) {
            index = this.items.length - 1;
        }

        // Save state
        this.index = index;

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
        if (!this.enabled) {
            return;
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
    onJump: function(e) {
        e.preventDefault();

        if (!this.enabled) {
            return;
        }

        this.jump(e.target.get('data-index') || 0);
    }

});

    /**
     * Defines a component that can be instantiated through carousel().
     */
    Toolkit.createComponent('carousel', function(options) {
        return new Toolkit.Carousel(this, options);
    });

})();