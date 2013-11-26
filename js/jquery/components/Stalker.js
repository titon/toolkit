/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Toolkit.Stalker = Toolkit.Component.create(function(element, options) {

    /** Custom options */
    this.options = this.setOptions(Toolkit.Stalker.options, options);

    /** Element to scroll */
    this.element = this.setElement(element, this.options);

    /** Elements to apply active state to */
    this.target = null;
    this.targets = [];

    /** Elements that trigger the active state */
    this.marker = null;
    this.markers = [];

    /** Offset positioning for markers */
    this.offsets = [];

    /** Container used for scroll detection */
    this.container = null;

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        if (!this.options.target || !this.options.marker) {
            return;
        }

        this.element.addClass('stalker');

        if (this.element.css('overflow') === 'auto') {
            this.container = this.element;
        } else {
            this.container = $(window);
        }

        this.refresh();

        this.container.on('scroll', $.throttle(this.__scroll.bind(this), this.options.throttle));

        $(document).ready(this.__scroll.bind(this));

        this.fireEvent('init');
    };

    /**
     * Activate a target when a marker is triggered.
     *
     * @param {Element} marker
     * @param {Element} target
     * @returns {Toolkit.Stalker}
     */
    this.activate = function(marker, target) {
        this.marker = $(marker);
        this.target = target = $(target);

        var targets = this.targets;

        if (this.options.applyToParent) {
            targets.parent().removeClass('is-active');
            target.parent().addClass('is-active');

        } else {
            targets.removeClass('is-active');
            target.addClass('is-active');
        }

        this.fireEvent('activate', [marker, target]);

        return this;
    };

    /**
     * Deactivate the targets.
     *
     * @param {Element} marker
     * @returns {Toolkit.Stalker}
     */
    this.deactivate = function(marker) {
        var targets = this.targets;

        if (this.options.applyToParent) {
            targets.parent().removeClass('is-active');
        } else {
            targets.removeClass('is-active');
        }

        this.marker = null;
        this.target = null;
        this.fireEvent('deactivate', marker);

        return this;
    };

    /**
     * Gather the targets and markers used for stalking.
     *
     * @returns {Toolkit.Stalker}
     */
    this.refresh = function() {
        if (this.element.css('overflow') === 'auto' && !this.element.is('body')) {
            this.element[0].scrollTop = 0; // Set scroll to top so offsets are correct
        }

        this.target = null;
        this.targets = $(this.options.target);
        this.targets.addClass('stalker-target');

        this.marker = null;
        this.markers = $(this.options.marker);
        this.markers.addClass('stalker-marker');

        var isWindow = (this.container[0] === window),
            eTop = this.element.offset().top,
            offset,
            offsets = [];

        this.markers.each(function(index, marker) {
            marker = $(marker);
            offset = marker.offset();

            if (!isWindow) {
                offset.top -= eTop;
            }

            offsets.push(offset);
        });

        this.offsets = offsets;

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

        var scroll = this.container.scrollTop(),
            markers = this.markers,
            targets = this.targets,
            offsets = this.offsets,
            onlyWithin = this.options.onlyWithin,
            threshold = this.options.threshold;

        markers.each(function(index, marker) {
            marker = $(marker);

            var offset = offsets[index],
                top = offset.top - threshold,
                bot = offset.top + marker.height() + threshold,
                target = [];

            // Scroll is within the marker
            if (
                (onlyWithin && scroll >= top && scroll <= bot) ||
                (!onlyWithin && scroll >= top)
            ) {
                target = targets.filter(function() {
                    return ($(this).attr('href') === '#' + marker.attr('id'));
                });

                if (target.length) {
                    this.activate(marker, target[0]);
                }

            // Scroll went outside the marker
            } else if (this.marker && this.marker[0] === marker[0]) {
                this.deactivate(marker);
            }

        }.bind(this));

        this.fireEvent('scroll');
    };

    if (this.element.length) {
        this.initialize();
    }
});

Toolkit.Stalker.options = {
    target: '',
    marker: '',
    threshold: 50,
    throttle: 50,
    onlyWithin: true,
    applyToParent: true
};

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
            this.$stalker = new Toolkit.Stalker(this, options);
        }
    });
};

})(jQuery);