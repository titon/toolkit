/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../flags/touch'
], function($, isTouch) {

/**
 * An event that triggers when a swipe event occurs over a target element.
 * Uses touch events for touch devices, and mouse events for non-touch devices.
 *
 * Implementation is a heavily modified version of the swipe events found in jQuery Mobile.
 * Credits to the jQuery team for the original implementation.
 *
 * @returns {Object}
 */
$.event.special.swipe = (function() {
    var startEvent = isTouch ? 'touchstart' : 'mousedown',
        moveEvent = isTouch ? 'touchmove' : 'mousemove',
        stopEvent = isTouch ? 'touchend' : 'mouseup',
        swiping = false, // Flag For ensuring a single swipe at a time
        abs = Math.abs;

    function coords(e) {
        var data = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;

        return {
            time: (new Date()).getTime(),
            x: data.pageX,
            y: data.pageY
        };
    }

    function swipe(start, stop, selfTarget, origTarget) {
        if (!start || !stop) {
            return;
        }

        var settings = $.event.special.swipe,
            x = stop.x - start.x,
            y = stop.y - start.y,
            direction;

        if ((stop.time - start.time) <= settings.duration) {
            if (abs(x) >= settings.distance && abs(y) <= settings.restraint) {
                direction = (x < 0) ? 'left' : 'right';

            } else if (abs(y) >= settings.distance && abs(x) <= settings.restraint) {
                direction = (y < 0) ? 'up' : 'down';

            } else {
                return;
            }

            var props = {
                target: origTarget,
                swipestart: start,
                swipestop: stop
            };

            selfTarget
                .trigger($.Event('swipe', props))
                .trigger($.Event('swipe' + direction, props));
        }
    }

    return {
        duration: 1000, // Maximum time in milliseconds to travel
        distance: 50,   // Minimum distance required to travel
        restraint: 75,  // Maximum distance to travel in the opposite direction

        setup: function() {
            var self = $(this),
                start,
                target;

            /**
             * There's a major bug in Android devices where `touchend` events do not fire
             * without calling `preventDefault()` in `touchstart` or `touchmove`.
             * Because of this, we have to hack-ily implement functionality into `touchmove`.
             * We also can't use `touchcancel` as that fires prematurely and unbinds our move event.
             * More information on these bugs can be found here:
             *
             * https://code.google.com/p/android/issues/detail?id=19827
             * https://code.google.com/p/chromium/issues/detail?id=260732
             *
             * Using `touchcancel` is also rather unpredictable, as described here:
             *
             * http://alxgbsn.co.uk/2011/12/23/different-ways-to-trigger-touchcancel-in-mobile-browsers/
             */
            function move(e) {
                var to = coords(e);

                // Trigger `preventDefault()` if `x` is larger than `y` (scrolling horizontally).
                // If we `preventDefault()` while scrolling vertically, the window will not scroll.
                if (abs(start.x - to.x) > abs(start.y - to.y)) {
                    e.preventDefault();
                }
            }

            /**
             * When `touchend` or `touchcancel` is triggered, clean up the swipe state.
             * Also unbind `touchmove` events until another swipe occurs.
             */
            function cleanup() {
                start = target = null;
                swiping = false;

                self.off(moveEvent, move);
            }

            // Initialize the state when a touch occurs
            self.on(startEvent, function(e) {

                // Calling `preventDefault()` on start will disable clicking of elements (links, inputs, etc)
                // So only do it on an `img` element so it cannot be dragged
                if (!isTouch && e.target.tagName.toLowerCase() === 'img') {
                    e.preventDefault();
                }

                // Exit early if another swipe is occurring
                if (swiping) {
                    return;
                }

                start = coords(e);
                target = e.target;
                swiping = true;

                // Non-touch devices don't make use of the move event
                if (isTouch) {
                    self.on(moveEvent, move);
                }
            });

            // Trigger the swipe event when the touch finishes
            self.on(stopEvent, function(e) {
                swipe(start, coords(e), self, target);
                cleanup();
            });

            // Reset the state when the touch is cancelled
            self.on('touchcancel', cleanup);
        },

        teardown: function() {
            $(this).off(startEvent).off(moveEvent).off(stopEvent).off('touchcancel');
        }
    };
})();

// Set swipe methods and events
$.each('swipe swipeleft swiperight swipeup swipedown'.split(' '), function(i, name) {
    if (name !== 'swipe') {
        $.event.special[name] = {
            setup: function() {
                $(this).on('swipe', $.noop);
            },
            teardown: function() {
                $(this).off('swipe');
            }
        };
    }
});

});