/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import Component from '../Component';
import bind from '../decorators/bind';
import collectionOf from '../prop-types/collectionOf';
import { TOUCH } from '../flags';

const abs = Math.abs;

@bind
export default class Swipe extends Component {
  static module = {
    classNames: {
      default: 'event-swipe',
    },
  };

  static defaultProps = {
    // Minimum distance required to travel
    distance: 50,
    // Maximum time in milliseconds to travel
    duration: 1000,
    enabled: true,
    // Maximum distance to travel in the opposite direction
    restraint: 75,
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    distance: PropTypes.number,
    duration: PropTypes.number,
    enabled: PropTypes.bool.isRequired,
    onSwipe: collectionOf.func,
    onSwipeDown: collectionOf.func,
    onSwipeLeft: collectionOf.func,
    onSwipeRight: collectionOf.func,
    onSwipeUp: collectionOf.func,
    restraint: PropTypes.number,
  };

  state = {
    startCoords: null,
    swiping: false,
  };

  extractTranslateOffsets(element) {
    const match = element.style.transform.match(/translate(Z|X|Y|3d)?\(([,a-z%\-\d\s]+)\)/);
    const mapping = ['x', 'y', 'z'];
    const offsets = {
      x: 0,
      xUnit: '',
      y: 0,
      yUnit: '',
      z: 0,
      zUnit: '',
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
        match[2].split(',').forEach((value, i) => {
          offsets[mapping[i]] += parseFloat(value.trim());
        });
        break;
    }

    return offsets;
  }

  packageCoordinates(e) {
    const data = e.changedTouches ? e.changedTouches[0] : e;

    return {
      time: Date.now(),
      x: data.pageX,
      y: data.pageY,
    };
  }

  resetState() {
    this.setState({
      startCoords: null,
      swiping: false,
    });
  }

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

    const to = this.packageCoordinates(e);
    const start = this.state.startCoords;

    // Trigger `preventDefault()` if `x` is larger than `y` (scrolling horizontally).
    // If we `preventDefault()` while scrolling vertically, the window will not scroll.
    if (abs(start.x - to.x) > abs(start.y - to.y)) {
      e.preventDefault();
    }
  }

  handleOnStart(e) {
    // Calling `preventDefault()` will disable clicking of elements (links, inputs, etc).
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
      swiping: true,
    });
  }

  handleOnStop(e) {
    const { duration, distance, restraint } = this.props;
    const start = this.state.startCoords;
    const stop = this.packageCoordinates(e);

    if (!start || !stop) {
      return;
    }

    const x = stop.x - start.x;
    const y = stop.y - start.y;
    let direction = '';

    if ((stop.time - start.time) <= duration) {
      if (abs(x) >= distance && abs(y) <= restraint) {
        direction = (x < 0) ? 'Left' : 'Right';

      } else if (abs(y) >= distance && abs(x) <= restraint) {
        direction = (y < 0) ? 'Up' : 'Down';

      } else {
        return;
      }

      // Set details for event
      e.detail = {
        direction: direction.toLowerCase(),
        start,
        stop,
        swipe: true,
      };

      this.handleEvent('swipe', e);
      this.handleEvent(`swipe${direction}`, e);
    }

    this.resetState();
  }

  render() {
    const { children, enabled } = this.props;
    const swipeProps = {
      className: this.formatClass({
        'is-swiping': this.state.swiping,
      }),
    };

    if (enabled) {
      if (TOUCH) {
        swipeProps.onTouchStart = this.handleOnStart;
        swipeProps.onTouchEnd = this.handleOnStop;
        swipeProps.onTouchMove = this.handleOnMove;
        swipeProps.onTouchCancel = this.handleOnCancel;
      } else {
        swipeProps.onMouseDown = this.handleOnStart;
        swipeProps.onMouseUp = this.handleOnStop;
        swipeProps.onMouseMove = this.handleOnMove;
      }
    }

    return this.transferToChild(children, swipeProps);
  }
}
