/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Stalker = new Class({
    Extends: Toolkit.Component,
    Binds: ['__scroll'],

    /** Elements to apply active state to */
    targets: [],

    /** Elements that trigger the active state */
    markers: [],

    /** Offset positioning for markers */
    offsets: [],

    /** Default options */
    options: {
        target: '',
        targetBy: 'href',
        marker: '',
        markBy: 'id',
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

        if (!this.element || !this.options.target || !this.options.marker) {
            throw new Error('A marker and target is required');
        }

        this.element.addClass(Toolkit.options.vendor + 'stalker');

        this.refresh();
        this.bindEvents();
        this.fireEvent('init');
    },

    /**
     * Activate a target when a marker is entered.
     *
     * @param {Element} marker
     * @returns {Toolkit.Stalker}
     */
    activate: function(marker) {
        this._stalk(marker, 'activate');

        return this;
    },

    /**
     * Set scroll events on target element.
     *
     * @returns {Toolkit.Stalker}
     */
    bindEvents: function() {
        (this.element.getStyle('overflow') === 'auto' ? this.element : window)
            .addEvent('scroll:throttle(' + this.options.throttle + ')', this.__scroll);

        window.addEvent('domready', this.__scroll);

        return this;
    },

    /**
     * Deactivate a target when a marker is exited.
     *
     * @param {Element} marker
     * @returns {Toolkit.Stalker}
     */
    deactivate: function(marker) {
        this._stalk(marker, 'deactivate');

        return this;
    },

    /**
     * Gather the targets and markers used for stalking.
     *
     * @returns {Toolkit.Stalker}
     */
    refresh: function() {
        if (this.element.getStyle('overflow') === 'auto' && this.element !== document.body) {
            this.element.scrollTop = 0; // Set scroll to top so offsets are correct
        }

        this.targets = $$(this.options.target);
        this.targets.addClass(Toolkit.options.vendor + 'stalker-target');

        this.markers = $$(this.options.marker);
        this.markers.addClass(Toolkit.options.vendor + 'stalker-marker');

        this.offsets = this.markers.getCoordinates(this.element);

        return this;
    },

    /**
     * Either active or deactivate a target based on the marker.
     *
     * @private
     * @param {Element} marker
     * @param {String} type
     */
    _stalk: function(marker, type) {
        var isPrefix = Toolkit.options.isPrefix;

        // Stop all the unnecessary processing
        if (type === 'activate' && marker.hasClass(isPrefix + 'stalked')) {
            return;
        }

        var targetBy = this.options.targetBy,
            markBy = this.options.markBy,
            method = (type === 'activate') ? 'addClass' : 'removeClass',
            target = this.targets.filter(function(item) {
                return (item.get(targetBy).replace('#', '') === marker.get(markBy));
            });

        marker[method](isPrefix + 'stalked');

        if (this.options.applyToParent) {
            target.getParent()[method](isPrefix + 'active');
        } else {
            target[method](isPrefix + 'active');
        }

        this.fireEvent(type, [marker, target]);
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
            offsets = this.offsets,
            onlyWithin = this.options.onlyWithin,
            threshold = this.options.threshold;

        markers.each(function(marker, index) {
            var coords = offsets[index],
                top = coords.top - threshold,
                bot = coords.top + coords.height + threshold;

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

});

    /**
     * Defines a component that can be instantiated through stalker().
     */
    Toolkit.createComponent('stalker', function(options) {
        return new Toolkit.Stalker(this, options);
    });

})();