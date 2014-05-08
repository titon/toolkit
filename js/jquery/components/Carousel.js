/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Carousel = Toolkit.Component.extend(function(element, options) {
    var items, self = this;

    this.component = 'Carousel';
    this.version = '1.4.0';
    this.element = element = $(element);
    this.options = options = this.setOptions(options, element);

    // Set animation and ARIA
    element
        .aria('live', options.autoCycle ? 'assertive' : 'off')
        .addClass(options.animation);

    // Find all the items and set ARIA attributes
    this.items = items = element.find('.' + vendor + 'carousel-items li').each(function(index) {
        $(this)
            .attr({
                role: 'tabpanel',
                id: self.id('item', index)
            })
            .aria('hidden', (index > 0));
    });

    // Find all tabs and set ARIA attributes
    this.tabs = element.find('.' + vendor + 'carousel-tabs')
        .attr('role', 'tablist')
        .find('a').each(function(index) {
            $(this)
                .data('index', index)
                .attr({
                    role: 'tab',
                    id: self.id('tab', index)
                })
                .aria({
                    controls: self.id('item', index),
                    selected: false,
                    expanded: false
                });
        });

    // Currently displayed item by index
    this.index = -1;

    // The size (width or height) to cycle with
    this.cycleSize = 0;

    // Auto cycle timer
    this.timer = null;

    // Is the carousel stopped or paused?
    this.stopped = false;

    // Initialize events
    this.events = {
        'resize window': $.throttle(this.calculate, 50),
        'keydown window': 'onKeydown',
        'swipeleft element': 'next',
        'swipeup element': 'next',
        'swiperight element': 'prev',
        'swipedown element': 'prev',
        'click element .@carousel-tabs a': 'onJump',
        'click element .@carousel-next': 'next',
        'click element .@carousel-prev': 'prev'
    };

    if (options.stopOnHover) {
        this.events['mouseenter element'] = 'stop';
        this.events['mouseleave element'] = 'start';
    }

    this.initialize();

    // Fade animations can only display 1 at a time
    if (options.animation === 'fade') {
        options.itemsToShow = options.itemsToCycle = 1;
        options.infinite = true;
    }

    // Start the carousel
    this.calculate();
    this.start();
    this.jump(options.defaultIndex);
}, {

    /**
     * Calculate the widths or heights for the items, the wrapper, and the cycle.
     */
    calculate: function() {
        var animation = this.options.animation;

        // Fade doesn't need to calculate anything
        if (animation === 'fade') {
            return;
        }

        var dimension = (animation === 'slide-up') ? 'height' : 'width',
            wrapperWidth = this.element[dimension](),
            items = this.items,
            itemsToShow = this.options.itemsToShow;

        this.cycleSize = wrapperWidth / itemsToShow;

        // Set the item width and fit the proper amount based on itemCount
        items.css(dimension, this.cycleSize);

        // Set the wrapper width based on the outer wrapper and item count
        items.parent().css(dimension, wrapperWidth * (items.length / itemsToShow));
    },

    /**
     * Stop the carousel before destroying.
     */
    doDestroy: function() {
        this.jump(0);
        this.stop();
        clearInterval(this.timer);
    },

    /**
     * Go to the item indicated by the index number.
     * If the index is too large, jump to the beginning.
     * If the index is too small, jump to the end.
     *
     * @param {Number} index
     */
    jump: function(index) {
        var options = this.options,
            maxIndex = this.items.length - options.itemsToShow;

        if (options.infinite) {
            index = $.bound(index, this.items.length);
        } else {
            if (index >= maxIndex) {
                index = maxIndex;
            } else if (index < 0) {
                index = 0;
            }
        }

        if (index === this.index) {
            return;
        }

        // Update tabs and items state
        var toIndex = index + options.itemsToShow;

        this.tabs
            .removeClass('is-active')
            .aria('toggled', false)
            .slice(index, toIndex)
                .addClass('is-active')
                .aria('toggled', false);

        this.items
            .removeClass('is-active')
            .aria('hidden', true)
            .slice(index, toIndex)
                .addClass('is-active')
                .aria('hidden', false);

        // Animate and move the items
        var animation = options.animation;

        if (animation === 'fade') {
            this.items.conceal()
                .eq(index).reveal();

        } else {
            var wrapper = this.items.parent(),
                dimension = (animation === 'slide-up') ? 'top' : 'left',
                cycleSize = 0;

            // If we are infinite scrolling, reposition the item
            if (options.infinite) {

                // Reposition the item to the end of the list once the transition is complete
                // Don't set this callback on initial page load
                if (this.index !== -1) {
                    wrapper.transitionend(function() {
                        wrapper
                            .addClass('no-transition')
                            .css(dimension, 0)
                            .find('li:first')
                                .detach()
                                .appendTo(wrapper);

                        // Must be set in a timeout or else the transition will still occur
                        setTimeout(function() {
                            wrapper.removeClass('no-transition');
                        }, 10);
                    });

                    cycleSize = -this.cycleSize;
                }

            // Move the items over equal to the amount of indexes
            } else {
                cycleSize = -(index * this.cycleSize);
            }

            wrapper.css(dimension, cycleSize);
        }

        this.index = index;

        this.reset();
        this.fireEvent('jump', index);
    },

    /**
     * Go to the next item.
     */
    next: function() {
        this.jump(this.index + this.options.itemsToCycle);
    },

    /**
     * Go to the previous item.
     */
    prev: function() {
        this.jump(this.index - this.options.itemsToCycle);
    },

    /**
     * Reset the timer.
     */
    reset: function() {
        if (this.options.autoCycle) {
            clearInterval(this.timer);
            this.timer = setInterval(this.onCycle, this.options.duration);
        }
    },

    /**
     * Start the carousel.
     */
    start: function() {
        this.element.removeClass('is-stopped');
        this.stopped = false;

        this.fireEvent('start');
    },

    /**
     * Stop the carousel.
     */
    stop: function() {
        this.element.addClass('is-stopped');
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

        this.jump($(e.currentTarget).data('index') || 0);
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
    infinite: true,
    itemsToShow: 1,
    itemsToCycle: 1,
    defaultIndex: 0
});

Toolkit.create('carousel', function(options) {
    return new Toolkit.Carousel(this, options);
});