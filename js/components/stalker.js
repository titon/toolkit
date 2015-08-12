/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './component',
    '../extensions/throttle'
], function($, Toolkit, Component) {

var Stalker = Toolkit.Stalker = Component.extend({
    name: 'Stalker',
    version: '2.1.7',

    /** Container to monitor scroll events on. */
    container: $(window),

    /** Targets to active when a marker is reached. */
    targets: [],

    /** Markers to compare against. */
    markers: [],

    /** Top value for all markers. */
    offsets: [],

    /**
     * Initialize the stalker.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        element = this.setElement(element);
        options = this.setOptions(options);

        if (!options.target || !options.marker) {
            throw new Error('A marker and target is required');
        }

        if (element.css('overflow') === 'auto') {
            this.container = element;
        }

        // Initialize events
        this.addEvents([
            ['scroll', 'container', $.throttle(this.onScroll.bind(this), options.throttle)],
            ['ready', 'document', 'onScroll']
        ]);

        this.initialize();

        // Gather markets and targets
        this.refresh();
    },

    /**
     * Remove classes before destroying.
     */
    destructor: function() {
        this.targets.removeClass('is-active');
        this.markers.removeClass('is-marked');
    },

    /**
     * Activate a target when a marker is entered.
     *
     * @param {Element} marker
     */
    activate: function(marker) {
        this.stalk(marker, 'activate');
    },

    /**
     * Deactivate a target when a marker is exited.
     *
     * @param {Element} marker
     */
    deactivate: function(marker) {
        this.stalk(marker, 'deactivate');
    },

    /**
     * Either active or deactivate a target based on the marker.
     *
     * @param {Element} marker
     * @param {String} type
     */
    stalk: function(marker, type) {
        marker = $(marker);

        // Stop all the unnecessary processing
        if (type === 'activate' && marker.hasClass('is-stalked')) {
            return;
        } else if (type === 'deactivate' && !marker.hasClass('is-stalked')) {
            return;
        }

        var options = this.options,
            targetBy = options.targetBy,
            markBy = options.markBy,
            target = this.targets.filter(function() {
                return $(this).attr(targetBy).replace('#', '') === marker.attr(markBy);
            }),
            before,
            after,
            method;

        if (type === 'activate') {
            before = 'activating';
            after = 'activated';
            method = 'addClass';
        } else {
            before = 'deactivating';
            after = 'deactivated';
            method = 'removeClass';
        }

        this.fireEvent(before, [marker, target]);

        marker[method]('is-stalked');
        target[method]('is-active');

        this.fireEvent(after, [marker, target]);
    },

    /**
     * Gather the targets and markers used for stalking.
     */
    refresh: function() {
        var isWindow = this.container.is(window),
            eTop = this.element.offset().top,
            offset,
            offsets = [];

        if (this.element.css('overflow') === 'auto' && !this.element.is('body')) {
            this.element[0].scrollTop = 0; // Set scroll to top so offsets are correct
        }

        this.targets = $(this.options.target);

        this.markers = $(this.options.marker).each(function(index, marker) {
            offset = $(marker).offset();

            if (!isWindow) {
                offset.top -= eTop;
            }

            offsets.push(offset);
        });

        this.offsets = offsets;
    },

    /**
     * While the element is being scrolled, notify the targets when a marker is reached.
     *
     * @private
     */
    onScroll: function() {
        var scroll = this.container.scrollTop(),
            offsets = this.offsets,
            onlyWithin = this.options.onlyWithin,
            threshold = this.options.threshold;

        this.markers.each(function(index, marker) {
            marker = $(marker);

            var offset = offsets[index],
                top = offset.top - threshold,
                bot = offset.top + marker.height() - threshold;

            // Scroll is within the marker
            if (
                (onlyWithin && scroll >= top && scroll <= bot) ||
                (!onlyWithin && scroll >= top)
            ) {
                this.activate(marker);

            // Scroll went outside the marker
            } else {
                this.deactivate(marker);
            }
        }.bind(this));

        this.fireEvent('scroll');
    }

}, {
    target: '',
    targetBy: 'href',
    marker: '',
    markBy: 'id',
    threshold: 50,
    throttle: 50,
    onlyWithin: true,
    applyToParent: true
});

Toolkit.createPlugin('stalker', function(options) {
    return new Stalker(this, options);
});

return Stalker;
});
