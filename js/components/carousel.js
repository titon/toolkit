/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './component',
    '../events/swipe',
    '../extensions/transitionend',
    '../extensions/throttle'
], function($, Toolkit, Component) {

var Carousel = Toolkit.Carousel = Component.extend({
    name: 'Carousel',
    version: '2.1.7',

    /** Is the carousel currently animating? */
    animating: false,

    /** The parent list that contains the items. */
    container: null,

    /** Currently displayed item by index. */
    index: -1,

    /** Collection of items to display in the carousel. */
    items: [],

    /** Is the carousel stopped or paused? */
    stopped: false,

    /** Collection of tabs to use for jumping to items. */
    tabs: [],

    /** Cycle timer. */
    timer: null,

    /** The dimension (width or height) to read sizes from. */
    _dimension: '',

    /** The position (left, right, or top) to modify for cycling. */
    _position: '',

    /** The size (width/height, margin) of each item. */
    _sizes: [],

    /** The index to reset to while infinite scrolling. */
    _resetTo: null,

    /**
     * Initialize the carousel.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        var items, self = this;

        element = this.setElement(element);
        options = this.setOptions(options, element);

        // Set animation and ARIA
        element
            .aria('live', options.autoCycle ? 'assertive' : 'off')
            .addClass(options.animation);

        // Find the item container and disable transitions for initial load
        this.container = element.find(this.ns('items'))
            .addClass('no-transition');

        // Find all the items and set ARIA attributes
        this.items = items = this.container.find('> li').each(function(index) {
            $(this)
                .attr({
                    role: 'tabpanel',
                    id: self.id('item', index)
                })
                .data('carousel-index', index)
                .aria('hidden', (index > 0));
        });

        // Find all tabs and set ARIA attributes
        this.tabs = element.find(this.ns('tabs'))
            .attr('role', 'tablist')
            .find('a').each(function(index) {
                $(this)
                    .data('carousel-index', index)
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

        // Set events
        this.addEvents([
            ['resize', 'window', $.throttle(this.calculate.bind(this), 50)],
            ['keydown', 'window', 'onKeydown'],
            ['click', 'element', 'onJump', this.ns('tabs') + ' a'],
            ['click', 'element', 'next', this.ns('next')],
            ['click', 'element', 'prev', this.ns('prev')],
            ['click', 'element', 'start', this.ns('start')],
            ['click', 'element', 'stop', this.ns('stop')]
        ]);

        if (options.swipe) {
            this.addEvents([
                ['swipeleft', 'element', 'next'],
                ['swipeup', 'element', 'next'],
                ['swiperight', 'element', 'prev'],
                ['swipedown', 'element', 'prev']
            ]);
        }

        if (options.stopOnHover) {
            this.addEvents([
                ['mouseenter', 'element', 'stop'],
                ['mouseleave', 'element', 'start']
            ]);
        }

        // Initialize
        this.initialize();

        // Prepare the carousel
        this._setupState();
        this._buildClones();

        // Start the carousel
        this.calculate();
        this.start();
        this.jump(options.defaultIndex);
    },

    /**
     * Stop the carousel before destroying.
     */
    destructor: function() {
        this.stop();

        // Go to first item
        this.jump(0);

        // Remove clones
        var dir = this._position || 'left';

        this.container.transitionend(function() {
            $(this)
                .addClass('no-transition')
                .css(dir, 0)
                .find('li.is-cloned')
                    .remove();
        });
    },

    /**
     * Calculate the widths or heights for the items, the wrapper, and the cycle.
     */
    calculate: function() {
        if (this.options.animation === 'fade') {
            return;
        }

        var dimension = this._dimension, // height or width
            containerSize = 0,
            sizes = [];

        this.container.removeAttr('style');

        this.items.each(function() {
            var item = $(this).removeAttr('style'),
                size = item[dimension](),
                marginStart = parseInt(item.css('margin-' + (dimension === 'width' ? 'left' : 'top')), 10),
                marginEnd = parseInt(item.css('margin-' + (dimension === 'width' ? 'right' : 'bottom')), 10),
                totalSize = size + marginStart + marginEnd;

            containerSize += totalSize;

            sizes.push({
                size: size,
                totalSize: totalSize,
                marginStart: marginStart,
                marginEnd: marginEnd,
                clone: item.hasClass('is-cloned')
            });

            // Set the size of the item explicitly
            item.css(dimension, size);
        });

        // Store the sizes
        this._sizes = sizes;

        // Set the container width/height
        this.container.css(dimension, containerSize);
    },

    /**
     * Go to the item indicated by the index number.
     *
     * @param {Number} index
     */
    jump: function(index) {
        if (this.animating) {
            return;
        }

        var indexes = this._getIndex(index),
            cloneIndex = indexes[0], // The index including clones
            visualIndex = indexes[1]; // The index excluding clones

        // Exit early if jumping to same index
        if (visualIndex === this.index) {
            return;
        }

        this.fireEvent('jumping', [this.index]);

        // Update tabs and items state
        this._updateTabs(visualIndex);
        this._updateItems(cloneIndex);

        // Animate and move the items
        this._beforeCycle();

        if (this.options.animation === 'fade') {
            this.items
                .conceal(true)
                .eq(visualIndex)
                    .transitionend(this._afterCycle.bind(this))
                    .reveal(true);

        } else {
            this.container
                .transitionend(this._afterCycle.bind(this))
                .css(this._position, -this._getSizeSum(cloneIndex));
        }

        // Store the index
        this.index = visualIndex;

        this.reset();
        this.fireEvent('jumped', [visualIndex]);
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
            this.timer = setInterval(this.onCycle.bind(this), this.options.duration);
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

        clearInterval(this.timer);

        this.fireEvent('stop');
    },

    /**
     * Functionality to trigger after a cycle transition has ended.
     * Will set animating to false and re-enable jumping.
     *
     * If `resetTo` is set, then reset the internal DOM index for infinite scrolling.
     * Also clean-up the `no-transition` class from the container.
     *
     * @private
     */
    _afterCycle: function() {
        this.animating = false;

        var container = this.container,
            resetTo = this._resetTo;

        // Reset the currently shown item to a specific index
        // This achieves the circular infinite scrolling effect
        if (resetTo !== null) {
            container
                .addClass('no-transition')
                .css(this._position, -this._getSizeSum(resetTo));

            this._updateItems(resetTo);
            this._resetTo = null;
        }

        // Set in a timeout or transition will still occur
        setTimeout(function() {
            container.removeClass('no-transition');
            this.fireEvent('cycled');
        }.bind(this), 15); // IE needs a minimum of 15
    },

    /**
     * Functionality to trigger before a cycle transition begins.
     * Will set the animating flag to true so that jumping is disabled.
     *
     * @private
     */
    _beforeCycle: function() {
        this.animating = true;
        this.fireEvent('cycling');
    },

    /**
     * Create clones to support infinite scrolling.
     * The beginning set of cloned items should be appended to the end,
     * while the end set of cloned items should be prepended to the beginning.
     *
     * @private
     */
    _buildClones: function() {
        var options = this.options,
            items = this.items,
            container = this.container,
            itemsToShow = options.itemsToShow;

        if (!options.infinite) {
            return;
        }

        // Append the first items
        items.slice(0, itemsToShow)
            .clone()
            .addClass('is-cloned')
            .removeAttr('id')
            .removeAttr('role')
            .appendTo(container);

        // Prepend the last items
        items.slice(-itemsToShow)
            .clone()
            .addClass('is-cloned')
            .removeAttr('id')
            .removeAttr('role')
            .prependTo(container);

        // Refresh items list
        this.items = container.find('> li');
    },

    /**
     * Determine the index to jump to while taking cloned elements and infinite scrolling into account.
     * Will return an array for the DOM element index (including clones) and the visual indication index
     * for active states.
     *
     * @param {Number} index    The visual index (not the clone index)
     * @returns {Array}
     * @private
     */
    _getIndex: function(index) {
        var options = this.options,
            itemsToShow = options.itemsToShow,
            visualIndex,
            cloneIndex;

        index = parseInt(index, 10);

        if (options.infinite) {
            var lengthWithClones = this.items.length,
                lengthWithoutClones = lengthWithClones - (itemsToShow * 2);

            // If the cycle reaches the clone past the end
            if (index >= lengthWithoutClones) {
                this._resetTo = 0 + itemsToShow;

                // Set the literal index to the clone on the end
                cloneIndex = lengthWithClones - itemsToShow;

                // Reset the visual index to 0
                visualIndex = 0;

            // If cycle reaches the clone past the beginning
            } else if (index <= -itemsToShow) {
                this._resetTo = lengthWithoutClones;

                // Set the literal index to the clone on the beginning
                cloneIndex = 0;

                // Reset the visual index to the last
                visualIndex = lengthWithoutClones - itemsToShow;

            // If cycle is within the normal range
            } else {
                this._resetTo = null;

                // We need to alter the actual index to account for the clones
                visualIndex = index;
                cloneIndex = index + itemsToShow;
            }

        } else {
            var element = this.element.removeClass('no-next no-prev'),
                maxIndex = this.items.length - itemsToShow;

            // If cycle reaches the last visible item, remove the next button or rewind
            if (index >= maxIndex) {
                index = maxIndex;

                if (options.loop) {
                    if (index === this.index && this.index === maxIndex) {
                        index = 0;
                    }
                } else {
                    element.addClass('no-next');
                }

            // If cycle reaches the first visible item, remove prev button or fast forward
            } else if (index <= 0) {
                index = 0;

                if (options.loop) {
                    if (index === this.index && this.index === 0) {
                        index = maxIndex;
                    }
                } else {
                    element.addClass('no-prev');
                }
            }

            cloneIndex = visualIndex = index;
        }

        return [cloneIndex, visualIndex];
    },

    /**
     * Calculate the size to cycle width based on the sum of all items up to but not including the defined index.
     *
     * @param {Number} index    - Includes the clone index
     * @returns {Number}
     * @private
     */
    _getSizeSum: function(index) {
        var sum = 0;

        $.each(this._sizes, function(i, value) {
            if (i < index) {
                sum += value.totalSize;
            }
        });

        return sum;
    },

    /**
     * Setup the carousel state to introspecting property values and resetting options.
     *
     * @private
     */
    _setupState: function() {
        var options = this.options,
            animation = options.animation;

        // Cycling more than the show amount causes unexpected issues
        if (options.itemsToCycle > options.itemsToShow) {
            options.itemsToCycle = options.itemsToShow;
        }

        // Fade animations can only display 1 at a time
        if (animation === 'fade') {
            options.itemsToShow = options.itemsToCycle = 1;
            options.infinite = false;

        // Determine the dimension and position based on animation
        } else if (animation === 'slide-up') {
            this._dimension = 'height';
            this._position = 'top';

        } else if (animation === 'slide') {
            this._dimension = 'width';
            this._position = options.rtl ? 'right' : 'left';
        }
    },

    /**
     * Update the active state for the items while taking into account cloned elements.
     *
     * @param {Number} index
     * @private
     */
    _updateItems: function(index) {
        this.items
            .removeClass('is-active')
            .aria('hidden', true)
            .slice(index, index + this.options.itemsToShow)
                .addClass('is-active')
                .aria('hidden', false);
    },

    /**
     * Update the active state for the tab indicators.
     *
     * @param {Number} start
     * @private
     */
    _updateTabs: function(start) {
        var itemsToShow = this.options.itemsToShow,
            length = this.items.length,
            stop = start + itemsToShow,
            set = $([]),
            tabs = this.tabs
                .removeClass('is-active')
                .aria('toggled', false);

        if (!tabs.length) {
            return;
        }

        if (this.options.infinite) {
            length = length - (itemsToShow * 2);
        }

        if (start >= 0) {
            set = set.add(tabs.slice(start, stop));
        } else {
            set = set.add(tabs.slice(0, stop));
            set = set.add(tabs.slice(start));
        }

        if (stop > length) {
            set = set.add(tabs.slice(0, stop - length));
        }

        set
            .addClass('is-active')
            .aria('toggled', true);
    },

    /**
     * Event handler for cycling between items.
     * Will stop cycling if carousel is stopped.
     *
     * @private
     */
    onCycle: function() {
        if (!this.stopped) {
            if (this.options.reverse) {
                this.prev();
            } else {
                this.next();
            }
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

        this.jump($(e.currentTarget).data('carousel-index') || 0);
    },

    /**
     * Event handle for keyboard events.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onKeydown: function(e) {
        switch (e.keyCode) {
            case 37: this.prev(); break;
            case 38: this.jump(0); break;
            case 39: this.next(); break;
            case 40: this.jump(-1); break;
            default: return;
        }

        e.preventDefault();
    }

}, {
    animation: 'slide',
    duration: 5000,
    autoCycle: true,
    stopOnHover: true,
    infinite: true,
    loop: true,
    reverse: false,
    rtl: Toolkit.isRTL,
    swipe: Toolkit.isTouch,
    itemsToShow: 1,
    itemsToCycle: 1,
    defaultIndex: 0
});

Toolkit.createPlugin('carousel', function(options) {
    return new Carousel(this, options);
});

return Carousel;
});
