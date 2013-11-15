/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Stalker = Titon.Component.create(function(element, options) {

    /** Custom options */
    this.options = this.setOptions($.fn.stalker.options, options);

    /** Element to scroll */
    this.element = this.setElement(element, this.options);

    /** Elements to apply active state to */
    this.target = null;
    this.targets = [];

    /** Elements that trigger the active state */
    this.markers = [];

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        if (!this.options.target) {
            return;
        }

        this.refresh();

        this.element.on('scroll', $.throttle(this.__scroll.bind(this), this.options.throttle));

        $(document).ready(this.__scroll.bind(this));

        this.fireEvent('init');
    };

    /**
     * Activate a target by element.
     *
     * @param {Element} target
     * @returns {Titon.Stalker}
     */
    this.activate = function(target) {
        this.target = target = $(target);

        var targets = this.targets,
            options = this.options;

        if (options.applyToParent) {
            targets.parent().removeClass('is-active');
            target.parent().addClass('is-active');

        } else {
            targets.removeClass('is-active');
            target.addClass('is-active');
        }

        this.fireEvent('activate', target);

        return this;
    };

    /**
     * Activate a target by index.
     *
     * @param {Number} index
     * @returns {Titon.Stalker}
     */
    this.jump = function(index) {
        var targets = this.targets;

        if (index >= targets.length) {
            index = 0;
        } else if (index < 0) {
            index = targets.length - 1;
        }

        return this.activate(targets[index]);
    };

    /**
     * Gather the targets and markers used for stalking.
     *
     * @returns {Titon.Stalker}
     */
    this.refresh = function() {
        this.targets = $(this.options.target);
        this.markers = this.element.find(this.options.marker);

        return this;
    };

    /**
     * While the element is being scrolled, notify the targets when a marker is reached.
     *
     * @private
     */
    this.__scroll = function() {
        if (!this.enabled) {
            return;
        }

        var el = this.element,
            elTop = el.offset().top,
            markers = this.markers,
            targets = this.targets,
            threshold = this.options.threshold;

        markers.each(function(index, marker) {
            var y = $(marker).offset().top - elTop,
                target = [];

            if (y >= 0 && y <= threshold) {
                target = targets.filter(function() {
                    return ($(this).attr('href') === '#' + $(marker).attr('id'));
                });

                if (target.length) {
                    this.activate(target[0]);
                }
            }

        }.bind(this));

        this.fireEvent('scroll');
    };

    if (this.element.length) {
        this.initialize();
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
 * @returns {jQuery}
 */
$.fn.stalker = function(options) {
    return this.each(function() {
        if (!this.$stalker) {
            this.$stalker = new Titon.Stalker(this, options);
        }
    });
};

$.fn.stalker.options = {
    target: '',
    marker: '*[id]',
    threshold: 50,
    throttle: 50,
    applyToParent: true
};

})(jQuery);