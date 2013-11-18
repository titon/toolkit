/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Stalker = new Class({
    Extends: Titon.Component,
    Binds: ['__scroll'],

    /** Elements to apply active state to */
    target: null,
    targets: [],

    /** Elements that trigger the active state */
    marker: null,
    markers: [],

    /** Offset positioning for markers */
    offsets: [],

    /** Default options */
    options: {
        target: '',
        marker: '*[id]',
        threshold: 50,
        throttle: 50,
        onlyWithin: true,
        applyToParent: true,

        // Events
        onScroll: null,
        onActivate: null,
        onDeactivate: null
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

        if (!this.element || !this.options.target) {
            return;
        }

        this.element.addClass('stalker');

        this.refresh();
        this.bindEvents();
        this.fireEvent('init');
    },

    /**
     * Activate a target when a marker is triggered.
     *
     * @param {Element} marker
     * @param {Element} target
     * @returns {Titon.Stalker}
     */
    activate: function(marker, target) {
        this.marker = marker;
        this.target = target;

        var targets = this.targets;

        if (this.options.applyToParent) {
            targets.getParent().removeClass('is-active');
            target.getParent().addClass('is-active');

        } else {
            targets.removeClass('is-active');
            target.addClass('is-active');
        }

        this.fireEvent('activate', [marker, target]);

        return this;
    },

    /**
     * Set scroll events on target element.
     *
     * @returns {Titon.Stalker}
     */
    bindEvents: function() {
        (this.element.getStyle('overflow') === 'auto' ? this.element : window)
            .addEvent('scroll:throttle(' + this.options.throttle + ')', this.__scroll);

        window.addEvent('domready', this.__scroll);

        return this;
    },

    /**
     * Deactivate the targets.
     *
     * @param {Element} marker
     * @returns {Titon.Stalker}
     */
    deactivate: function(marker) {
        var targets = this.targets;

        if (this.options.applyToParent) {
            targets.getParent().removeClass('is-active');
        } else {
            targets.removeClass('is-active');
        }

        this.marker = null;
        this.target = null;
        this.fireEvent('deactivate', marker);

        return this;
    },

    /**
     * Gather the targets and markers used for stalking.
     *
     * @returns {Titon.Stalker}
     */
    refresh: function() {
        if (this.element.getStyle('overflow') === 'auto' && this.element !== document.body) {
            this.element.scrollTop = 0; // Set scroll to top so offsets are correct
        }

        this.target = null;
        this.targets = $$(this.options.target);
        this.targets.addClass('stalker-target');

        this.marker = null;
        this.markers = this.element.getElements(this.options.marker);
        this.markers.addClass('stalker-marker');

        this.offsets = this.markers.getCoordinates(this.element);

        return this;
    },

    /**
     * While the element is being scrolled, notify the targets when a marker is reached.
     *
     * @private
     */
    __scroll: function() {
        if (!this.enabled) {
            return;
        }

        var scroll = this.element.getScroll().y,
            markers = this.markers,
            targets = this.targets,
            offsets = this.offsets,
            onlyWithin = this.options.onlyWithin,
            threshold = this.options.threshold;

        markers.each(function(marker, index) {
            var coords = offsets[index],
                top = coords.top - threshold,
                bot = coords.top + coords.height + threshold,
                target = [];

            // Scroll is within the marker
            if (
                (onlyWithin && scroll >= top && scroll <= bot) ||
                (!onlyWithin && scroll >= top)
            ) {
                target = targets.filter(function(item) {
                    return (item.get('href') === '#' + marker.get('id'));
                });

                if (target.length) {
                    this.activate(marker, target[0]);
                }

            // Scroll went outside the marker
            } else if (this.marker === marker) {
                this.deactivate(marker);
            }

        }.bind(this));

        this.fireEvent('scroll');
    }

});

/**
 * Enable element scroll stalking by calling stalker().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('stalker-id').stalker({
 *         threshold: 100
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Stalker}
 */
Element.implement('stalker', function(options) {
    if (!this.$stalker) {
        this.$stalker = new Titon.Stalker(this, options);
    }

    return this;
});

})();