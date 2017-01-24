/**
 * @copyright   2010-2017, The Titon Project
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

  componentWillMount() {
    window.addEventListener('resize', this.handleOnResize);
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentDidMount() {
    const { delay } = this.props;

    if (delay > 0) {
      this.timer = setTimeout(this.handleDelay, delay);
    }

    this.calculateElement();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.loaded && !this.state.loaded) {
      emitEvent(this, 'onLoading');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loaded && !prevState.loaded) {
      emitEvent(this, 'onLoaded');

    // Attempt to load anytime the state changes
    } else {
      this.attemptToLoad();
    }
  }

  componentWillUnmount() {
    this.clearEvents();
    this.clearTimer();
  }

  attemptToLoad() {
    if (this.inViewport()) {
      this.loadElement();
    }
  }

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

  calculateViewport() {
    this.setState({
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    });
  }

  clearEvents() {
    window.removeEventListener('resize', this.handleOnResize);
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  clearTimer() {
    clearTimeout(this.timer);
  }

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

  loadElement() {
    this.clearEvents();
    this.clearTimer();
    this.setState({
      loaded: true,
    });
  }

  @bind
  handleDelay() {
    this.loadElement();
  }

  @bind
  @debounce(150)
  handleOnResize() {
    this.calculateElement();
    this.calculateViewport();
  }

  @bind
  @throttle(50)
  handleOnScroll() {
    this.calculateViewport();
  }
}
