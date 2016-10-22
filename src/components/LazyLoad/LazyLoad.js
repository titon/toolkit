/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import debounce from '../../decorators/debounce';
import invariant from '../../utility/invariant';
import emitEvent from '../../utility/emitEvent';
import throttle from '../../decorators/throttle';
import MODULE from './module';

export default class LazyLoad extends Component {
  static module = MODULE;

  static defaultProps = {
    delay: 0,
    threshold: 200,
  };

  static propTypes = {
    delay: PropTypes.number,
    threshold: PropTypes.number,
  };

  /**
   * Setup state.
   */
  constructor() {
    super();

    this.timer = 0;
    this.state = {
      elementHeight: 0,
      elementLeft: 0,
      elementTop: 0,
      elementWidth: 0,
      loaded: false,
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    };
  }

  /**
   * Bind events before mounting.
   */
  componentWillMount() {
    window.addEventListener('resize', this.handleOnResize);
    window.addEventListener('scroll', this.handleOnScroll);
  }

  /**
   * Calculate element once we have a DOM element,
   * and start the delay timer.
   */
  componentDidMount() {
    const { delay } = this.props;

    if (delay > 0) {
      this.timer = setTimeout(this.handleDelay, delay);
    }

    this.calculateElement();
  }

  /**
   * Emit a `loading` event if the element is being loaded.
   *
   * @param {Object} nextProps
   * @param {Object} nextState
   */
  componentWillUpdate(nextProps, nextState) {
    if (nextState.loaded && !this.state.loaded) {
      emitEvent(this, 'onLoading');
    }
  }

  /**
   * Emit a `loaded` event if the element was loaded.
   *
   * @param {Object} prevProps
   * @param {Object} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.state.loaded && !prevState.loaded) {
      emitEvent(this, 'onLoaded');

    // Attempt to load anytime the state changes
    } else {
      this.attemptToLoad();
    }
  }

  /**
   * Unbind events before mounting.
   */
  componentWillUnmount() {
    this.clearEvents();
    this.clearTimer();
  }

  /**
   * Attempt to load the element by checking the viewport.
   */
  attemptToLoad() {
    if (this.inViewport()) {
      this.loadElement();
    }
  }

  /**
   * Calculate and cache the elements dimensions and offsets.
   */
  calculateElement() {
    const element = this.element;

    invariant(typeof element !== 'undefined', 'An `element` ref must be defined.');

    this.setState({
      elementHeight: element.offsetHeight,
      elementLeft: element.offsetLeft,
      elementTop: element.offsetTop,
      elementWidth: element.offsetWidth,
    });
  }

  /**
   * Calculate the size of the viewport and current scroll.
   */
  calculateViewport() {
    this.setState({
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    });
  }

  /**
   * Remove all bound event listeners.
   */
  clearEvents() {
    window.removeEventListener('resize', this.handleOnResize);
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  /**
   * Remove the delay timer.
   */
  clearTimer() {
    clearTimeout(this.timer);
  }

  /**
   * Verify that the element is within the current browser viewport.
   *
   * @returns {Boolean}
   */
  inViewport() {
    const { scrollX, scrollY, ...state } = this.state;
    const { threshold } = this.props;
    const top = state.elementTop;
    const left = state.elementLeft;
    const width = state.viewportWidth;
    const height = state.viewportHeight;

    return (
      // Below the top
      (top >= (scrollY - threshold)) &&
      // Above the bottom
      (top <= (scrollY + height + threshold)) &&
      // Right of the left
      (left >= (scrollX - threshold)) &&
      // Left of the right
      (left <= (scrollX + width + threshold))
    );
  }

  /**
   * Set the loaded state to true, unbind events, and clear the timer.
   */
  loadElement() {
    this.clearEvents();
    this.clearTimer();
    this.setState({
      loaded: true,
    });
  }

  /**
   * Handler that loads the element after the delay has triggered.
   */
  @bind
  handleDelay() {
    this.loadElement();
  }

  /**
   * Handler that re-calculates the element and viewport when the browser is resized.
   */
  @bind
  @debounce(150)
  handleOnResize() {
    this.calculateElement();
    this.calculateViewport();
  }

  /**
   * Handler that checks if the element is within the viewport and loads it.
   */
  @bind
  @throttle(50)
  handleOnScroll() {
    this.calculateViewport();
  }
}
