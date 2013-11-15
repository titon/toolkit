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
    markers: [],

    /** Default options */
    options: {
        target: '',
        marker: '*[id]',
        threshold: 50,
        throttle: 50,
        applyToParent: true,

        // Events
        onScroll: null,
        onActivate: null
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

        this.refresh();
        this.bindEvents();
        this.fireEvent('init');
    },

    /**
     * Activate a target by element.
     *
     * @param {Element} target
     * @returns {Titon.Stalker}
     */
    activate: function(target) {
        this.target = target;

        var targets = this.targets,
            options = this.options;

        if (options.applyToParent) {
            targets.getParent().removeClass('is-active');
            target.getParent().addClass('is-active');

        } else {
            targets.removeClass('is-active');
            target.addClass('is-active');
        }

        this.fireEvent('activate', target);

        return this;
    },

    /**
     * Set scroll events on target element.
     *
     * @returns {Titon.Stalker}
     */
    bindEvents: function() {
        this.element.addEvent('scroll:throttle(' + this.options.throttle + ')', this.__scroll);

        window.addEvent('domready', this.__scroll);

        return this;
    },

    /**
     * Activate a target by index.
     *
     * @param {Number} index
     * @returns {Titon.Stalker}
     */
    jump: function(index) {
        var targets = this.targets;

        if (index >= targets.length) {
            index = 0;
        } else if (index < 0) {
            index = targets.length - 1;
        }

        return this.activate(targets[index]);
    },

    /**
     * Gather the targets and markers used for stalking.
     *
     * @returns {Titon.Stalker}
     */
    refresh: function() {
        this.targets = $$(this.options.target);
        this.markers = this.element.getElements(this.options.marker);

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

        var el = this.element,
            elTop = el.getPosition().y,
            markers = this.markers,
            targets = this.targets,
            threshold = this.options.threshold;

        markers.each(function(marker) {
            var y = marker.getPosition().y - elTop,
                target = [];

            if (y >= 0 && y <= threshold) {
                target = targets.filter(function(item) {
                    return (item.get('href') === '#' + marker.get('id'));
                });

                if (target.length) {
                    this.activate(target[0]);
                }
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