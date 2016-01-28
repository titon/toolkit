/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from '../Component';
import autoBind from '../decorators/autoBind';
import collectionOf from '../prop-types/collectionOf';
import cssClassName from '../prop-types/cssClassName';
import { TOUCH } from '../flags';

const abs = Math.abs;

@autoBind
export default class Swipe extends Component {
    static defaultProps = {
        className: ['event', 'swipe'],
        enabled: true,
        draggable: true,
        duration: 1000,             // Maximum time in milliseconds to travel
        distance: 50,               // Minimum distance required to travel
        restraint: 75               // Maximum distance to travel in the opposite direction
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        className: cssClassName.isRequired,
        enabled: PropTypes.bool.isRequired,
        draggable: PropTypes.bool,
        duration: PropTypes.number,
        distance: PropTypes.number,
        restraint: PropTypes.number,
        onSwipe: collectionOf.func,
        onSwipeUp: collectionOf.func,
        onSwipeRight: collectionOf.func,
        onSwipeDown: collectionOf.func,
        onSwipeLeft: collectionOf.func
    };

    state = {
        swiping: false,
        startCoords: null
    };

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
     * @param {SyntheticTouchEvent} e
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
            startCoords: null
        });
    }

    /**
     * Reset the state when `touchcancel` is triggered.
     */
    handleOnCancel() {
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
     *
     * @param {SyntheticEvent} e
     */
    handleOnMove(e) {
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
     * @param {SyntheticEvent} e
     */
    handleOnStart(e) {
        // Calling `preventDefault()` on start will disable clicking of elements (links, inputs, etc).
        // So only do it on an `img` element so it cannot be dragged.
        if (!TOUCH && e.target.tagName.toLowerCase() === 'img') {
            e.preventDefault();
        }

        // Exit early if another swipe is occurring
        if (this.state.swiping) {
            return;
        }

        this.setState({
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
     * @param {SyntheticEvent} e
     */
    handleOnStop(e) {
        let start = this.state.startCoords,
            stop = this.packageCoordinates(e),
            props = this.props,
            x = 0,
            y = 0,
            direction = '';

        if (!start || !stop) {
            return;
        }

        x = stop.x - start.x;
        y = stop.y - start.y;

        if ((stop.time - start.time) <= props.duration) {
            if (abs(x) >= props.distance && abs(y) <= props.restraint) {
                direction = (x < 0) ? 'Left' : 'Right';

            } else if (abs(y) >= props.distance && abs(x) <= props.restraint) {
                direction = (y < 0) ? 'Up' : 'Down';

            } else {
                return;
            }

            // Set details for event
            e.detail = {
                swipe: true,
                direction: direction.toLowerCase(),
                start,
                stop
            };

            this.handleEvent('swipe', e);
            this.handleEvent('swipe' + direction, e);
        }

        this.resetState();
    }

    /**
     * Rendering requires a single child, that will be cloned and modified
     * by passing custom touch and swipe events.
     *
     * @returns {JSX}
     */
    render() {
        let child = Children.only(this.props.children),
            props = {
                className: this.formatClass(this.props.className, {
                    'is-swiping': this.state.swiping
                })
            };

        // Overwrite any previous touch or mouse events
        if (this.props.enabled) {
            if (TOUCH) {
                props.onTouchStart = this.handleOnStart;
                props.onTouchEnd = this.handleOnStop;
                props.onTouchMove = this.handleOnMove;
                props.onTouchCancel = this.handleOnCancel;
            } else {
                props.onMouseDown = this.handleOnStart;
                props.onMouseUp = this.handleOnStop;
                props.onMouseMove = this.handleOnMove;
            }
        }

        // Append the events class name
        if (child.props.className) {
            props.className += ' ' + child.props.className;
        }

        return React.cloneElement(child, props);
    }
}
