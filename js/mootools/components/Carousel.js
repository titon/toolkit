/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

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
        stopOnHover: true
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

        var items, self = this;

        // Get elements
        this.items = items = element.getElements('.' + vendor + 'carousel-items li').each(function(item, index) {
            item
                .set({
                    role: 'tabpanel',
                    id: self.id('item', index)
                })
                .aria('hidden', (index > 0));
        });

        element.getElements('.' + vendor + 'carousel-tabs').set('role', 'tablist');

        this.tabs = element.getElements('.' + vendor + 'carousel-tabs a').each(function(tab, index) {
            tab
                .set({
                    'data-index': index,
                    role: 'tab',
                    id: self.id('tab', index)
                })
                .aria({
                    controls: self.id('item', index),
                    selected: false,
                    expanded: false
                });
        });

        // Set animation and ARIA
        element
            .aria('live', options.autoCycle ? 'assertive' : 'off')
            .addClass(options.animation);

        // Set events
        this.events = {
            'keydown window': 'onKeydown',
            'swipe element': 'onSwipe',
            'click element .@carousel-tabs a': 'onJump',
            'click element .@carousel-next': 'next',
            'click element .@carousel-prev': 'prev'
        };

        if (options.stopOnHover) {
            this.events['mouseenter element'] = 'stop';
            this.events['mouseleave element'] = 'start';
        }

        this.enable();
        this.fireEvent('init');

        // Set some sizes for responsiveness
        switch (options.animation) {
            case 'fade':
                items[0].reveal();
            break;
            case 'slide':
                items[0].getParent().setStyle('width', (items.length * 100) + '%');
                items.setStyle('width', (100 / items.length) + '%');
            break;
        }

        this.reset().start();
    },

    /**
     * Stop the carousel before destroying.
     */
    doDestroy: function() {
        clearInterval(this.timer);
        this.stop();
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
        index = Number.from(index).bound(this.items.length);

        if (index === this.index) {
            return this;
        }

        // Update tabs
        this.tabs
            .removeClass('is-active')
            .aria({ expanded: false, selected: false });

        if (this.tabs[index]) {
            this.tabs[index]
                .addClass('is-active')
                .aria({ expanded: true, selected: true });
        }

        // Update items
        this.items
            .aria('hidden', true);

        if (this.items[index]) {
            this.items[index].aria('hidden', false);
        }

        // Animate!
        var animation = this.options.animation;

        // Don't use conceal() as it causes the animation to flicker
        if (animation === 'fade') {
            this.items.removeClass('show');
            this.items[index].reveal();

        } else {
            this.items.getParent()
                .setStyle((animation === 'slide-up') ? 'top' : 'left', -(index * 100) + '%');
        }

        this.index = index;

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
        this.element.removeClass('is-stopped');
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

Toolkit.create('carousel', function(options) {
    return new Toolkit.Carousel(this, options);
});