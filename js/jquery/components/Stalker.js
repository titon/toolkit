/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Stalker = Toolkit.Component.create(function(element, options) {
        this.component = 'Stalker';
        this.version = '0.0.0';

        // Set options and element
        this.options = options = this.setOptions(options);
        this.element = element = this.setElement(element);

        if (!options.target || !options.marker) {
            return;
        }

        // Elements to apply active state to
        this.target = null;
        this.targets = [];

        // Elements that trigger the active state
        this.marker = null;
        this.markers = [];

        // Offset positioning for markers
        this.offsets = [];

        // Container used for scroll detection
        this.container = null;

        // Set events
        element.addClass(Toolkit.options.vendor + 'stalker');

        if (element.css('overflow') === 'auto') {
            this.container = element;
        } else {
            this.container = $(window);
        }

        this.refresh();

        this.container.on('scroll', $.throttle(this.__scroll.bind(this), options.throttle));

        $(document).ready(this.__scroll.bind(this));

        this.fireEvent('init');
    }, {

        /**
         * Activate a target when a marker is triggered.
         *
         * @param {Element} marker
         * @param {Element} target
         * @returns {Toolkit.Stalker}
         */
        activate: function(marker, target) {
            this.marker = $(marker);
            this.target = target = $(target);

            var targets = this.targets;

            if (this.options.applyToParent) {
                targets.parent().removeClass(Toolkit.options.isPrefix + 'active');
                target.parent().addClass(Toolkit.options.isPrefix + 'active');

            } else {
                targets.removeClass(Toolkit.options.isPrefix + 'active');
                target.addClass(Toolkit.options.isPrefix + 'active');
            }

            this.fireEvent('activate', [marker, target]);

            return this;
        },

        /**
         * Deactivate the targets.
         *
         * @param {Element} marker
         * @returns {Toolkit.Stalker}
         */
        deactivate: function(marker) {
            var targets = this.targets;

            if (this.options.applyToParent) {
                targets.parent().removeClass(Toolkit.options.isPrefix + 'active');
            } else {
                targets.removeClass(Toolkit.options.isPrefix + 'active');
            }

            this.marker = null;
            this.target = null;
            this.fireEvent('deactivate', marker);

            return this;
        },

        /**
         * Gather the targets and markers used for stalking.
         *
         * @returns {Toolkit.Stalker}
         */
        refresh: function() {
            if (this.element.css('overflow') === 'auto' && !this.element.is('body')) {
                this.element[0].scrollTop = 0; // Set scroll to top so offsets are correct
            }

            this.target = null;
            this.targets = $(this.options.target)
                .addClass(Toolkit.options.vendor + 'stalker-target');

            this.marker = null;
            this.markers = $(this.options.marker)
                .addClass(Toolkit.options.vendor + 'stalker-marker');

            var isWindow = this.container.is(window),
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
                        this.activate(marker, target.item(0));
                    }

                // Scroll went outside the marker
                } else if (this.marker && this.marker.is(marker)) {
                    this.deactivate(marker);
                }

            }.bind(this));

            this.fireEvent('scroll');
        }

    }, {
        target: '',
        marker: '',
        threshold: 50,
        throttle: 50,
        onlyWithin: true,
        applyToParent: true
    });

    /**
     * Defines a component that can be instantiated through stalker().
     */
    Toolkit.createComponent('stalker', function(options) {
        return new Toolkit.Stalker(this, options);
    });

})(jQuery);