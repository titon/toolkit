/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import debounce from '../../decorators/debounce';
import invariant from '../../utility/invariant';
import throttle from '../../decorators/throttle';

export default class LazyLoad extends Component {
    static defaultProps = {
        delay: 0,
        threshold: 200
    };

    static propTypes = {
        delay: PropTypes.number,
        threshold: PropTypes.number
    };

    /**
     * Setup state.
     */
    constructor() {
        super();

        this.timer = 0;
        this.state = {
            loaded: false,
            elementTop: 0,
            elementLeft: 0,
            elementWidth: 0,
            elementHeight: 0,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            scrollX: window.pageXOffset,
            scrollY: window.pageYOffset
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
        let delay = this.props.delay;

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
            this.emitEvent('loading');
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
            this.emitEvent('loaded');

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
        let element = this.refs.element;

        invariant(typeof element !== 'undefined', 'An `element` ref must be defined.');

        this.setState({
            elementTop: element.offsetTop,
            elementLeft: element.offsetLeft,
            elementWidth: element.offsetWidth,
            elementHeight: element.offsetHeight
        });
    }

    /**
     * Calculate the size of the viewport and current scroll.
     */
    calculateViewport() {
        this.setState({
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            scrollX: window.pageXOffset,
            scrollY: window.pageYOffset
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
        /* eslint operator-linebreak: 0 */

        let { scrollX, scrollY, ...state } = this.state,
            top = state.elementTop,
            left = state.elementLeft,
            width = state.viewportWidth,
            height = state.viewportHeight,
            threshold = this.props.threshold;

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
            loaded: true
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
