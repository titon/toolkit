/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../Component';
import ItemList from './ItemList';
import bind from '../../decorators/bind';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Carousel extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        autoStart: true,
        defaultIndex: 0,
        duration: 5000,
        elementClassName: 'carousel',
        infinite: true,
        loop: true,
        modifier: 'slide',
        pauseOnHover: true,
        reverse: false,
        toCycle: 1,
        toShow: 1
    };

    static propTypes = {
        autoStart: PropTypes.bool,
        children: PropTypes.node,
        className: cssClass,
        defaultIndex: PropTypes.number,
        duration: PropTypes.number,
        elementClassName: cssClass.isRequired,
        infinite: PropTypes.bool,
        loop: PropTypes.bool,
        modifier: PropTypes.oneOf(['slide', 'slide-up', 'fade']),
        onCycled: collection.func,
        onCycling: collection.func,
        onStart: collection.func,
        onStop: collection.func,
        pauseOnHover: PropTypes.bool,
        reverse: PropTypes.bool,
        toCycle: PropTypes.number,
        toShow: PropTypes.number
    };

    state = {
        animating: false,
        index: 0,
        stopped: true
    };

    /**
     * Generate a UID.
     */
    constructor() {
        super();

        this.timer = null;
        this.generateUID();
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            activeIndices: this.getActiveIndices(),
            afterAnimation: this.afterAnimation,
            currentIndex: this.state.index,
            firstIndex: this.getFirstIndex(),
            infiniteScroll: this.props.infinite,
            isItemActive: this.isItemActive,
            itemCount: this.countItems(),
            lastIndex: this.getLastIndex(),
            loopedScroll: this.props.loop,
            modifier: this.props.modifier,
            nextItem: this.nextItem,
            prevItem: this.prevItem,
            showItem: this.showItem,
            startCycle: this.startCycle,
            stopCycle: this.stopCycle,
            uid: this.getUID(),
            visibleCount: this.props.toShow
        };
    }

    /**
     * Set the default index and bind events before mounting.
     */
    componentWillMount() {
        this.showItem(this.props.defaultIndex);

        window.addEventListener('keydown', this.handleOnKeyDown);
    }

    /**
     * Start the transition animation after rendering,
     * but before children have updated.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     */
    componentWillUpdate(nextProps, nextState) {
        if (nextState.index !== this.state.index) {
            this.beforeAnimation();
        }
    }

    /**
     * Remove events and timers when unmounting.
     */
    componentWillUnmount() {
        clearTimeout(this.timer);

        window.removeEventListener('keydown', this.handleOnKeyDown);
    }

    /**
     * Functionality to trigger after the cycle animation occurs.
     * We must set the `animating` state to false or we get locked in
     * an unusable state.
     *
     * This *should* be handled by a child component, like `ItemList`.
     */
    @bind
    afterAnimation() {
        this.setState({
            animating: false
        });

        this.emitEvent('cycled', this.state.index);
    }

    /**
     * Functionality to trigger before the cycle animation occurs.
     *
     * Do not set the `animation` state here as it causes 2 renders
     * and because `componentWillUpdate()` does not allow state changes.
     */
    beforeAnimation() {
        this.emitEvent('cycling', this.state.index);
    }

    /**
     * Counts the number of children found within the `ItemList` child component.
     *
     * @returns {Number}
     */
    countItems() {
        let count = 0,
            children = Children.toArray(this.props.children);

        // Use a for loop so that we can break out
        for (let i = 0; i < children.length; i++) {
            if (children[i].type === ItemList) {
                count = Children.count(children[i].props.children);
                break;
            }
        }

        return count;
    }

    /**
     * Return an array of all item indices that are currently active and visible.
     *
     * @returns {Number[]}
     */
    getActiveIndices() {
        let currentIndex = this.state.index,
            visibleCount = this.props.toShow,
            active = [];

        for (let i = 0; i < visibleCount; i++) {
            active.push(currentIndex + i);
        }

        return active;
    }

    /**
     * Returns the first index that can be cycled to.
     *
     * @returns {Number}
     */
    getFirstIndex() {
        return 0;
    }

    /**
     * Returns the last index that can be cycled to.
     *
     * @returns {Number}
     */
    getLastIndex() {
        return (this.countItems() - this.props.toShow);
    }

    /**
     * Handles the automatic cycle timer.
     */
    @bind
    handleOnCycle() {
        if (this.state.stopped) {
            return;
        }

        if (this.props.reverse) {
            this.prevItem();
        } else {
            this.nextItem();
        }
    }

    /**
     * Cycle between items based on the arrow key pressed.
     *
     * @param {SyntheticKeyboardEvent} e
     */
    @bind
    handleOnKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                this.prevItem();
                break;

            case 'ArrowUp':
                this.showItem(this.getFirstIndex());
                break;

            case 'ArrowRight':
                this.nextItem();
                break;

            case 'ArrowDown':
                this.showItem(this.getLastIndex());
                break;

            default:
                return;
        }

        e.preventDefault();
    }

    /**
     * Stop the cycle when entering the carousel.
     */
    @bind
    handleOnMouseEnter() {
        if (this.props.pauseOnHover) {
            this.stopCycle();
        }
    }

    /**
     * Start the cycle when exiting the carousel.
     */
    @bind
    handleOnMouseLeave() {
        if (this.props.pauseOnHover) {
            this.startCycle();
        }
    }

    /**
     * Returns true if the current item is the first index.
     *
     * @returns {Boolean}
     */
    isAtFirst() {
        return (this.state.index === this.getFirstIndex());
    }

    /**
     * Returns true if the current item is the last index.
     *
     * @returns {Boolean}
     */
    isAtLast() {
        return (this.state.index === this.getLastIndex());
    }

    /**
     * Returns true if the item at the specified index is active based
     * on the state index and how many visible items to display.
     *
     * @param {Number} index
     * @returns {Boolean}
     */
    @bind
    isItemActive(index) {
        let currentIndex = this.state.index;

        return (index >= currentIndex && index <= (currentIndex + this.props.toShow - 1));
    }

    /**
     * Cycle to the next item.
     */
    @bind
    nextItem() {
        this.showItem(this.state.index + this.props.toCycle);
    }

    /**
     * Cycle to the previous item.
     */
    @bind
    prevItem() {
        this.showItem(this.state.index - this.props.toCycle);
    }

    /**
     * Reset the automatic cycle timer.
     */
    resetCycle() {
        this.stopCycle();
        this.startCycle();
    }

    /**
     * Cycle to the item at the specified index.
     *
     * @param {Number} index
     */
    @bind
    showItem(index) {
        /* eslint no-lonely-if: 0 */

        if (this.state.animating) {
            return;
        }

        let props = this.props,
            currentIndex = this.state.index,
            lastIndex = this.getLastIndex(),
            firstIndex = this.getFirstIndex(),
            itemCount = this.countItems();

        if (props.infinite) {
            if (index >= itemCount) {
                index = firstIndex + (index - itemCount);

            } else if (index < firstIndex) {
                index = itemCount + index;
            }

        } else {
            if (index > lastIndex) {
                index = props.loop ? firstIndex + (index - lastIndex - 1) : lastIndex;

            } else if (index < firstIndex) {
                index = props.loop ? lastIndex + index + 1 : firstIndex;
            }
        }

        // Stop the cycle if on the last item
        if (!props.loop && index === lastIndex) {
            this.stopCycle();

            // Reset the cycle timer
        } else if (props.autoStart) {
            this.startCycle();
        }

        // Break out early if the same index
        if (currentIndex === index) {
            return;
        }

        this.setState({
            animating: true,
            index
        });
    }

    /**
     * Start the automatic cycle timer.
     */
    @bind
    startCycle() {
        clearTimeout(this.timer);

        this.timer = setTimeout(this.handleOnCycle, this.props.duration);

        this.setState({
            stopped: false
        });

        this.emitEvent('start');
    }

    /**
     * Stop the automatic cycle timer.
     */
    @bind
    stopCycle() {
        clearTimeout(this.timer);

        this.setState({
            stopped: true
        });

        this.emitEvent('stop');
    }

    /**
     * Render the wrapping carousel element.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                role="tablist"
                id={this.formatID('carousel')}
                className={this.formatClass(props.elementClassName, props.className, {
                    ['@' + props.modifier]: true,
                    'is-animating': this.state.animating,
                    'is-stopped': this.state.stopped,
                    'no-next': (!props.loop && this.isAtLast()),
                    'no-prev': (!props.loop && this.isAtFirst())
                })}
                aria-live={props.autoStart ? 'assertive' : 'off'}
                onMouseEnter={this.handleOnMouseEnter}
                onMouseLeave={this.handleOnMouseLeave}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
