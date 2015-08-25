/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Event from 'events/Event';
import { isTouch } from 'extensions/flags';
import assign from 'lodash/object/assign';

let startEvent = isTouch ? 'touchstart' : 'mousedown',
    stopEvent = isTouch ? 'touchend' : 'mouseup',
    moveEvent = isTouch ? 'touchmove' : 'mousemove';

export default class Swipe extends Event {

    /**
     * Store the element to bind events to, any custom options,
     * and prepare the state and handlers.
     *
     * @param {HTMLElement} context
     * @param {object} options
     */
    constructor(context, options = {}) {
        super(context, assign({
            duration: 1000, // Maximum time in milliseconds to travel
            distance: 50,   // Minimum distance required to travel
            restraint: 75   // Maximum distance to travel in the opposite direction
        }, options));

        this.originalTarget = null;
        this.startCoords = null;
        this.swiping = false;

        // Event handlers
        this.cleanupHandler = this.cleanup.bind(this);
        this.moveHandler = this.move.bind(this);
        this.startHandler = this.start.bind(this);
        this.stopHandler = this.stop.bind(this);

        // Bind default events
        this.enable();
    }

    /**
     * When `touchend` or `touchcancel` is triggered, clean up the swipe state.
     * Also unbind `touchmove` events until another swipe occurs.
     */
    cleanup() {
        this.originalTarget = null;
        this.startCoords = null;
        this.swiping = false;

        this.context.removeEventListener(moveEvent, this.moveHandler);
    }

    /**
     * Return the page coordinates from the current event.
     *
     * @param {Event} e
     * @returns {{time: number, x: Number, y: Number}}
     */
    coords(e) {
        let data = e.changedTouches ? e.changedTouches[0] : e;

        return {
            time: Date.now(),
            x: data.pageX,
            y: data.pageY
        };
    }

    /**
     * Bind the start, stop, and cancel events.
     */
    disable() {
        this.context.addEventListener(startEvent, this.startHandler);
        this.context.addEventListener(stopEvent, this.stopHandler);
        this.context.addEventListener('touchcancel', this.cleanupHandler);
    }

    /**
     * Unbind the start, stop, and cancel events.
     */
    enable() {
        this.context.removeEventListener(moveEvent, this.moveHandler);
        this.context.removeEventListener(startEvent, this.startHandler);
        this.context.removeEventListener(stopEvent, this.stopHandler);
        this.context.removeEventListener('touchcancel', this.cleanupHandler);
    }

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
    move(e) {
        let to = this.coords(e),
            start = this.startCoords,
            abs = Math.abs;

        // Trigger `preventDefault()` if `x` is larger than `y` (scrolling horizontally).
        // If we `preventDefault()` while scrolling vertically, the window will not scroll.
        if (abs(start.x - to.x) > abs(start.y - to.y)) {
            e.preventDefault();
        }
    }

    /**
     * Start the swipe process by logging the original target and coordinates.
     *
     * @param {Event} e
     */
    start(e) {
        // Calling `preventDefault()` on start will disable clicking of elements (links, inputs, etc).
        // So only do it on an `img` element so it cannot be dragged.
        if (!isTouch && e.target.tagName.toLowerCase() === 'img') {
            e.preventDefault();
        }

        // Exit early if another swipe is occurring
        if (this.swiping) {
            return;
        }

        this.originalTarget = e.target;
        this.startCoords = this.coords(e);
        this.swiping = true;

        // Non-touch devices don't make use of the move event
        if (isTouch) {
            this.context.addEventListener(moveEvent, this.moveHandler);
        }
    }

    /**
     * Once the touch or mouse event stops, validate the final coordinates against the
     * starting coordinates, and determine the direction the swipe occurred.
     *
     * If everything went smoothly, dispatch the `swipe` and direction specific swipe events.
     *
     * @param {Event} e
     */
    stop(e) {
        let start = this.startCoords,
            stop = this.coords(e),
            abs = Math.abs;

        if (!start || !stop) {
            return;
        }

        let options = this.options,
            x = stop.x - start.x,
            y = stop.y - start.y,
            direction;

        if ((stop.time - start.time) <= options.duration) {
            if (abs(x) >= options.distance && abs(y) <= options.restraint) {
                direction = (x < 0) ? 'left' : 'right';

            } else if (abs(y) >= options.distance && abs(x) <= options.restraint) {
                direction = (y < 0) ? 'up' : 'down';

            } else {
                return;
            }

            let props = {
                target: this.originalTarget,
                start: start,
                stop: stop
            };

            this.dispatch('swipe', props);
            this.dispatch('swipe' + direction, props);
        }

        this.cleanup();
    }
}
