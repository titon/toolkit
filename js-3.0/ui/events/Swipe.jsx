/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../Component';
import { touch } from '../../ext/flags';
import bem from '../../ext/utility/bem';
import collectionOf from '../../ext/prop-types/collectionOf';

const abs = Math.abs;

export default class Swipe extends Component {
    constructor() {
        super();

        this.state = {
            swiping: false,
            originalTarget: null,
            startCoords: null
        };

        this.autoBind();
    }

    /**
     * Render the wrapper that binds mouse and touch events.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props,
            enabled = props.enabled,
            className = enabled ? bem('event', '', 'swipe') : '';

        return React.createElement(props.tagName, {
            className: this.formatClass(className, props.className),
            style: props.style || {},
            onTouchStart: (enabled && touch) ? this.onStart : null,
            onTouchEnd: (enabled && touch) ? this.onStop : null,
            onTouchMove: (enabled && touch) ? this.onMove : null,
            onTouchCancel: (enabled && touch) ? this.onCancel : null,
            onMouseDown: (enabled && !touch) ? this.onStart : null,
            onMouseUp: (enabled && !touch) ? this.onStop : null,
            onMouseMove: (enabled && !touch) ? this.onMove : null
        }, props.children);
    }

    /**
     * Extract the X, Y, and Z vaues from the elements `transform: translate` properties.
     *
     * TODO: Add support for non-px and percentages, maybe?
     *
     * @param {Element} element
     * @returns {{x: Number, y: Number, z: Number}}
     */
    extractTranslateOffsets(element) {
        let match = element.style.transform.match(/translate(Z|X|Y|3d)?\(([,a-z%\-\d\s]+)\)/),
            mapping = ['x', 'y', 'z'],
            offsets = {
                x: 0,
                xUnit: '',
                y: 0,
                yUnit: '',
                z: 0,
                zUnit: ''
            };

        if (!match) {
            return offsets;
        }

        switch (match[1]) {
            case 'X':
                offsets.x += parseFloat(match[2]);
                break;

            case 'Y':
                offsets.y += parseFloat(match[2]);
                break;

            case 'Z':
                offsets.z += parseFloat(match[2]);
                break;

            default:
                match[2].split(',').forEach((value, i) => offsets[mapping[i]] += parseFloat(value.trim()));
                break;
        }

        return offsets;
    }

    /**
     * Return the page coordinates from the current event.
     *
     * @param {Event} e
     * @returns {{time: Number, x: Number, y: Number}}
     */
    packageCoordinates(e) {
        let data = e.changedTouches ? e.changedTouches[0] : e;

        return {
            time: Date.now(),
            x: data.pageX,
            y: data.pageY
        };
    }

    /**
     * Reset the swipe state.
     */
    resetState() {
        this.setState({
            swiping: false,
            originalTarget: null,
            startCoords: null
        });
    }

    /**
     * Reset the state when `touchcancel` is triggered.
     */
    onCancel() {
        this.resetState();
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
    onMove(e) {
        if (!this.state.swiping) {
            return;
        }

        let to = this.packageCoordinates(e),
            start = this.state.startCoords;

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
    onStart(e) {
        // Calling `preventDefault()` on start will disable clicking of elements (links, inputs, etc).
        // So only do it on an `img` element so it cannot be dragged.
        if (!touch && e.target.tagName.toLowerCase() === 'img') {
            e.preventDefault();
        }

        // Exit early if another swipe is occurring
        if (this.state.swiping) {
            return;
        }

        this.setState({
            originalTarget: e.currentTarget,
            startCoords: this.packageCoordinates(e),
            swiping: true
        });
    }

    /**
     * Once the touch or mouse event stops, validate the final coordinates against the
     * starting coordinates, and determine the direction the swipe occurred.
     *
     * If everything went smoothly, dispatch the `swipe` and direction specific swipe events.
     *
     * @param {Event} e
     */
    onStop(e) {
        let start = this.state.startCoords,
            stop = this.packageCoordinates(e);

        if (!start || !stop) {
            return;
        }

        let props = this.props,
            x = stop.x - start.x,
            y = stop.y - start.y,
            direction;

        if ((stop.time - start.time) <= props.duration) {
            if (abs(x) >= props.distance && abs(y) <= props.restraint) {
                direction = (x < 0) ? 'Left' : 'Right';

            } else if (abs(y) >= props.distance && abs(x) <= props.restraint) {
                direction = (y < 0) ? 'Up' : 'Down';

            } else {
                return;
            }

            let args = [this.state.originalTarget, start, stop];

            this.emitEvent('swipe', [direction, ...args]);
            this.emitEvent('swipe' + direction, args);
        }

        this.resetState();
    }
}

Swipe.defaultProps = {
    enabled: true,
    tagName: 'div',
    className: '',
    duration: 1000,     // Maximum time in milliseconds to travel
    distance: 50,       // Minimum distance required to travel
    restraint: 75,      // Maximum distance to travel in the opposite direction
    onSwipe: null,
    onSwipeUp: null,
    onSwipeRight: null,
    onSwipeDown: null,
    onSwipeLeft: null
};

Swipe.propTypes = {
    enabled: PropTypes.bool.isRequired,
    tagName: PropTypes.string,
    className: PropTypes.string,
    duration: PropTypes.number,
    distance: PropTypes.number,
    restraint: PropTypes.number,
    onSwipe: collectionOf(PropTypes.func),
    onSwipeUp: collectionOf(PropTypes.func),
    onSwipeRight: collectionOf(PropTypes.func),
    onSwipeDown: collectionOf(PropTypes.func),
    onSwipeLeft: collectionOf(PropTypes.func)
};
