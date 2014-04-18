/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Carousel = Toolkit.Component.extend(function(element, options) {
    var items, self = this;

    this.component = 'Carousel';
    this.version = '1.3.1';
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
    this.index = 0;

    // Auto cycle timer
    this.timer = null;

    // Is the carousel stopped or paused?
    this.stopped = false;

    // Initialize events
    this.events = {
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

    // Set default positioning for responsiveness
    switch (options.animation) {
        case 'fade':
            items.item(0).reveal();
        break;
        case 'slide':
            items
                .css('width', (100 / items.length) + '%')
                .parent()
                    .css('width', (items.length * 100) + '%');
        break;
    }

    // Start the carousel
    this.reset();
    this.start();
}, {

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
     */
    jump: function(index) {
        index = $.bound(index, this.items.length);

        if (index === this.index) {
            return;
        }

        // Update tabs
        this.tabs
            .removeClass('is-active')
            .aria('toggled', false)
            .item(index)
                .addClass('is-active')
                .aria('toggled', true);

        // Update items
        this.items
            .aria('hidden', true)
            .item(index)
                .aria('hidden', false);

        // Animate!
        var animation = this.options.animation;

        // Don't use conceal() as it causes the animation to flicker
        if (animation === 'fade') {
            this.items
                .removeClass('show')
                .item(index)
                    .reveal();

        } else {
            this.items.parent()
                .css((animation === 'slide-up') ? 'top' : 'left', -(index * 100) + '%');
        }

        this.index = index;

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
    stopOnHover: true
});

Toolkit.create('carousel', function(options) {
    return new Toolkit.Carousel(this, options);
});