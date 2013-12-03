/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Toolkit.Carousel = Toolkit.Component.create(function(element, options) {

    /** Custom options */
    this.options = this.setOptions(Toolkit.Carousel.options, options);

    /** Carousel element */
    this.element = this.setElement(element, this.options);

    /** Is the carousel stopped? */
    this.stopped = false;

    /** Items and parent container */
    this.itemsWrapper = null;
    this.itemsList = null;
    this.items = [];

    /** Tabs and parent container */
    this.tabsWrapper = null;
    this.tabs = [];

    /** Previous and next buttons */
    this.prevButton = null;
    this.nextButton = null;

    /** The current and previous shown indices */
    this.previousIndex = 0;
    this.currentIndex = 0;

    /** Cycle timer */
    this.timer = null;

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        var options = this.options;

        // Get elements
        this.itemsWrapper = this.element.find(options.itemsElement);
        this.itemsList = this.itemsWrapper.children('ul, ol');
        this.items = this.itemsWrapper.find(options.itemElement);

        this.tabsWrapper = this.element.find(options.tabsElement);
        this.tabs = this.tabsWrapper.find(options.tabElement);

        this.nextButton = this.element.find(options.nextElement);
        this.prevButton = this.element.find(options.prevElement);

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
                this.items.item(0).reveal();
            break;
            case 'slide':
                this.itemsList.css('width', (this.items.length * 100) + '%');
                this.items.css('width', (100 / this.items.length) + '%');
            break;
        }

        // Store some data in the elements
        this.tabs.each(function(index) {
            $(this).data('index', index);
        });

        // Set events
        $(window)
            .on('keydown', function(e) {
                if ($.inArray(e.keyCode, [37, 38, 39, 40]) >= 0) {
                    e.preventDefault();
                }

                switch (e.keyCode) {
                    case 37: this.prev(); break;
                    case 38: this.jump(0); break;
                    case 39: this.next(); break;
                    case 40: this.jump(-1); break;
                }
            }.bind(this));

        if (options.stopOnHover) {
            this.element
                .on('mouseenter', this.stop.bind(this))
                .on('mouseleave', this.start.bind(this));
        }

        this.element
            .on('swipeleft', this.next.bind(this))
            .on('swiperight', this.prev.bind(this));

        this.tabs.on('click', this.__jump.bind(this));
        this.nextButton.on('click', this.next.bind(this));
        this.prevButton.on('click', this.prev.bind(this));

        this.start().reset();
        this.fireEvent('init');
    };

    /**
     * Go to the item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     * @returns {Toolkit.Carousel}
     */
    this.jump = function(index) {
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
            this.tabs
                .removeClass('is-active')
                .item(index).addClass('is-active');
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

        return this;
    };

    /**
     * Go to the next item.
     *
     * @returns {Toolkit.Carousel}
     */
    this.next = function() {
        this.jump(this.currentIndex + 1);

        return this;
    };

    /**
     * Go to the previous item.
     *
     * @returns {Toolkit.Carousel}
     */
    this.prev = function() {
        this.jump(this.currentIndex - 1);

        return this;
    };

    /**
     * Reset the timer.
     *
     * @returns {Toolkit.Carousel}
     */
    this.reset = function() {
        if (this.options.autoCycle) {
            clearInterval(this.timer);
            this.timer = setInterval(this.__cycle.bind(this), this.options.duration);
        }

        return this;
    };

    /**
     * Start the carousel.
     *
     * @returns {Toolkit.Carousel}
     */
    this.start = function() {
        this.element.removeClass('is-stopped');
        this.stopped = false;

        this.fireEvent('start');

        return this;
    };

    /**
     * Stop the carousel.
     *
     * @returns {Toolkit.Carousel}
     */
    this.stop = function() {
        this.element.addClass('is-stopped');
        this.stopped = true;

        this.fireEvent('stop');

        return this;
    };

    /**
     * Event handler for cycling between items.
     * Will stop cycling if carousel is stopped.
     *
     * @private
     */
    this.__cycle = function() {
        if (!this.enabled) {
            return;
        }

        // Don't cycle if the carousel has stopped
        if (!this.stopped) {
            this.fireEvent('cycle');
            this.next();
        }
    };

    /**
     * Event handler for jumping between items.
     *
     * @private
     * @param {Event} e
     */
    this.__jump = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.enabled) {
            return;
        }

        this.jump($(e.target).data('index') || 0);
    };

    if (this.element.length) {
        this.initialize();
    }
});

Toolkit.Carousel.options = {
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
};

/**
 * Allow the carousel to be created on elements by calling carousel().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('#carousel-id').carousel({
 *         stopOnHover: true
 *     });
 *
 * @param {Object} [options]
 * @returns {jQuery}
 */
$.fn.carousel = function(options) {
    return this.each(function() {
        $(this).addData('toolkit.carousel', function() {
            return new Toolkit.Carousel(this, options);
        });
    });
};

})(jQuery);