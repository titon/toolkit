/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../Component';
import ItemList from './ItemList';
import autoBind from '../../../ext/decorators/autoBind';
import bem from '../../../ext/utility/bem';
import collectionOf from '../../../ext/prop-types/collectionOf';
import debounce from '../../../ext/decorators/debounce';
import CONTEXT_TYPES from './ContextTypes';

@autoBind
export default class Carousel extends Component {
    constructor() {
        super();

        this.timer = null;
        this.state = {
            index: 0,
            stopped: true,
            animating: false,
            visible: 1,
            cloned: 0
        };

        this.generateUID();
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            uid: this.uid,
            modifier: this.props.modifier,
            currentIndex: this.state.index,
            activeIndices: this.getActiveIndices(),
            firstIndex: this.getFirstIndex(),
            lastIndex: this.getLastIndex(),
            itemCount: this.countItems(),
            visibleCount: this.state.visible,
            clonedCount: this.state.cloned,
            afterAnimation: this.afterAnimation,
            isItemActive: this.isItemActive,
            nextItem: this.nextItem,
            prevItem: this.prevItem,
            showItem: this.showItem,
            startCycle: this.startCycle,
            stopCycle: this.stopCycle
        };
    }

    /**
     * Before mounting, validate and correct specific props,
     * and setup the initial state.
     */
    componentWillMount() {
        // Set the default index
        this.showItem(this.props.defaultIndex);

        // Bind non-react events
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('resize', this.onResize);
    }

    /**
     * Calculate dimensions once mounted.
     */
    componentDidMount() {
        this.calculateVisibleItems();
    }

    /**
     * Emit `cycling` event after rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.index !== this.state.index) {
            this.beforeAnimation();

            // FIXME: Temporary
            this.afterAnimation();
        }
    }

    /**
     * Remove events when unmounting.
     */
    componentWillUnmount() {
        clearTimeout(this.timer);

        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('resize', this.onResize);
    }

    /**
     * Functionality to trigger after the cycle animation occurs.
     * We must set the `animating` state to false or we get locked in.
     */
    @autoBind
    afterAnimation() {
        this.setState({
            animating: false
        });

        this.emitEvent('cycled', [this.state.index]);
    }

    /**
     * Functionality to trigger before the cycle animation occurs.
     */
    beforeAnimation() {
        this.emitEvent('cycling', [this.state.index]);
    }

    /**
     * Calculate the number of items that are visible at the same time.
     */
    calculateVisibleItems() {
        let visible = 1,
            cloned = 0;

        if (this.props.modifier !== 'fade') {
            let wrapper = ReactDOM.findDOMNode(this),
                dimension = (this.props.modifier === 'slide-up') ? 'offsetHeight' : 'offsetWidth',
                child = wrapper.querySelector(`div[data-carousel-items] > ol > li`);

            if (child) {
                visible = Math.round(wrapper[dimension] / child[dimension]);
            }
        }

        if (this.props.infinite) {
            cloned = visible * 2;
        }

        this.setState({
            visible,
            cloned
        });
    }

    /**
     * Counts the number of children found within the `ItemList` child component.
     *
     * @returns {Number}
     */
    countItems() {
        let count = 0;

        Children.forEach(this.props.children, child => {
            if (child.type === ItemList) {
                count = Children.count(child.props.children);
            }
        });

        return count;
    }

    /**
     * Return an array of all item indices that are currently active and visible.
     *
     * @returns {Number[]}
     */
    getActiveIndices() {
        let currentIndex = this.state.index,
            visibleCount = this.state.visible,
            active = [];

        for (let i = 0; i < visibleCount; i++) {
            active.push(currentIndex + i);
        }

        return active;
    }

    /**
     * Returns the first index that can be cycled to, while taking cloned items into account.
     *
     * @returns {Number}
     */
    getFirstIndex() {
        return 0;
    }

    /**
     * Returns the last index that can be cycled to, while taking visible item counts
     * and cloned item indices into account.
     *
     * @returns {Number}
     */
    getLastIndex() {
        return (this.countItems() - this.state.visible);
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
    @autoBind
    isItemActive(index) {
        let currentIndex = this.state.index;

        return (index >= currentIndex && index <= (currentIndex + this.state.visible - 1));
    }

    /**
     * Cycle to the next item.
     */
    @autoBind
    nextItem() {
        this.showItem(this.state.index + this.props.perCycle);
    }

    /**
     * Cycle to the previous item.
     */
    @autoBind
    prevItem() {
        this.showItem(this.state.index - this.props.perCycle);
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
    @autoBind
    showItem(index) {
        /* eslint no-lonely-if: 0 */

        if (this.state.animating) {
            return;
        }

        let currentIndex = this.state.index,
            lastIndex = this.getLastIndex(),
            firstIndex = this.getFirstIndex(),
            itemCount = this.countItems(),
            loop = this.props.loop;

        if (this.props.infinite) {
            if (index >= itemCount) {
                index = firstIndex + (index - itemCount);

            } else if (index < firstIndex) {
                index = itemCount + index;
            }

        } else {
            if (index > lastIndex) {
                index = loop ? firstIndex + (index - lastIndex - 1) : lastIndex;

            } else if (index < firstIndex) {
                index = loop ? lastIndex + index + 1 : firstIndex;
            }
        }

        // Stop the cycle if on the last item
        if (!loop && index === lastIndex) {
            this.stopCycle();

            // Reset the cycle timer
        } else if (this.props.autoStart) {
            this.startCycle();
        }

        // Break out early if the same index
        if (currentIndex === index) {
            return;
        }

        this.setState({
            index,
            animating: true
        });
    }

    /**
     * Start the automatic cycle timer.
     */
    @autoBind
    startCycle() {
        clearTimeout(this.timer);

        this.timer = setTimeout(this.onCycle, this.props.duration);

        this.setState({
            stopped: false
        });

        this.emitEvent('start');
    }

    /**
     * Stop the automatic cycle timer.
     */
    @autoBind
    stopCycle() {
        clearTimeout(this.timer);

        this.setState({
            stopped: true
        });

        this.emitEvent('stop');
    }

    /**
     * Handles the automatic cycle timer.
     */
    onCycle() {
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
    onKeyDown(e) {
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
    onMouseEnter() {
        if (this.props.pauseOnHover) {
            this.stopCycle();
        }
    }

    /**
     * Start the cycle when exiting the carousel.
     */
    onMouseLeave() {
        if (this.props.pauseOnHover) {
            this.startCycle();
        }
    }

    /**
     * Re-calculate dimensions in case the element size has changed.
     */
    @debounce(100)
    onResize() {
        this.calculateVisibleItems();
    }

    /**
     * Render the wrapping carousel element.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props;

        return (
            <div
                role="tablist"
                id={this.formatID('carousel')}
                className={this.formatClass(props.className, bem(props.className, '', props.modifier), props.component, {
                    'is-stopped': this.state.stopped,
                    'is-animating': this.state.animating,
                    'no-next': (!props.loop && this.isAtLast()),
                    'no-prev': (!props.loop && this.isAtFirst())
                })}
                aria-live={props.autoStart ? 'assertive' : 'off'}
                onKeyDown={this.onKeyDown}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}>

                {props.children}
            </div>
        );
    }
}

Carousel.childContextTypes = CONTEXT_TYPES;

Carousel.defaultProps = {
    component: '',
    className: 'carousel',
    modifier: 'slide',
    duration: 5000,
    perCycle: 1,
    defaultIndex: 0,
    autoStart: true,
    pauseOnHover: true,
    infinite: true,
    loop: true,
    reverse: false
};

Carousel.propTypes = {
    children: PropTypes.node,
    component: PropTypes.string,
    className: PropTypes.string,
    modifier: PropTypes.oneOf(['slide', 'slide-up', 'fade']),
    duration: PropTypes.number,
    perCycle: PropTypes.number,
    defaultIndex: PropTypes.number,
    autoStart: PropTypes.bool,
    pauseOnHover: PropTypes.bool,
    infinite: PropTypes.bool,
    loop: PropTypes.bool,
    reverse: PropTypes.bool,
    onCycling: collectionOf.func,
    onCycled: collectionOf.func,
    onStart: collectionOf.func,
    onStop: collectionOf.func
};
