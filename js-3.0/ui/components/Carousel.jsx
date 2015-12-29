/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Titon from '../../Titon';
import Component from '../Component';
import Swipe from '../events/Swipe';
import bem from '../../ext/utility/bem';
import childrenOfType from '../../ext/prop-types/childrenOfType';
import collectionOf from '../../ext/prop-types/collectionOf';
import debounce from 'lodash/function/debounce';

export const CONTEXT_TYPES = {
    uid: PropTypes.string,
    modifier: PropTypes.string,

    currentIndex: PropTypes.number,
    activeIndices: PropTypes.array,
    firstIndex: PropTypes.number,
    lastIndex: PropTypes.number,
    itemCount: PropTypes.number,
    visibleCount: PropTypes.number,

    isItemActive: PropTypes.func,
    nextItem: PropTypes.func,
    prevItem: PropTypes.func,
    showItem: PropTypes.func,
    startCycle: PropTypes.func,
    stopCycle: PropTypes.func
};

/*----------------------------------------------------------------------------------------------------*/

export class Item extends Component {
    render() {
        let index = this.props.index,
            active = this.context.isItemActive(index);

        return (
            <li role="tabpanel"
                id={this.formatID('carousel-item', index)}
                className={this.formatClass(this.props.className, {
                    'is-active': active
                })}
                aria-hidden={!active}>

                {this.props.children}
            </li>
        );
    }
}

Item.contextTypes = CONTEXT_TYPES;

Item.defaultProps = {
    className: 'carousel-item',
    index: -1
};

Item.propTypes = {
    className: PropTypes.string,
    index: PropTypes.number.isRequired
};

/*----------------------------------------------------------------------------------------------------*/

export class ItemList extends Component {
    render() {
        let context = this.context,
            props = this.generateNestedProps(this.props, 'swipe');

        // Explicitly define certain props
        props.tagName = 'ol';
        props.style = { transform: this.getTranslateOffset() };

        // Trigger our listeners first
        props.onSwipeUp.unshift(context.nextItem);
        props.onSwipeRight.unshift(context.prevItem);
        props.onSwipeDown.unshift(context.prevItem);
        props.onSwipeLeft.unshift(context.nextItem);

        return (
            <div className={this.formatClass(this.props.className)} data-carousel-items>
                <Swipe {...props}>
                    {this.props.children}
                </Swipe>
            </div>
        );
    }

    /**
     * Calculate the size to cycle with based on the sum of all items up to but not including the defined index.
     *
     * @returns {String}
     */
    getTranslateOffset() {
        let context = this.context,
            modifier = context.modifier;

        if (modifier === 'fade') {
            return 'none';
        }

        let offset = context.currentIndex * (100 / context.visibleCount),
            x = (modifier === 'slide') ? -offset : 0,
            y = (modifier === 'slide-up') ? -offset: 0;

        return `translate3d(${x}%, ${y}%, 0)`;
    }
}

ItemList.contextTypes = CONTEXT_TYPES;

ItemList.defaultProps = {
    className: 'carousel-items',
    swipe: Titon.flags.touch,
    onSwipe: null,
    onSwipeUp: null,
    onSwipeRight: null,
    onSwipeDown: null,
    onSwipeLeft: null
};

ItemList.propTypes = {
    children: childrenOfType(Item),
    className: PropTypes.string,
    swipe: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    onSwipe: collectionOf(PropTypes.func),
    onSwipeUp: collectionOf(PropTypes.func),
    onSwipeRight: collectionOf(PropTypes.func),
    onSwipeDown: collectionOf(PropTypes.func),
    onSwipeLeft: collectionOf(PropTypes.func)
};

/*----------------------------------------------------------------------------------------------------*/

export class Tab extends Component {
    render() {
        let index = this.props.index,
            active = this.context.isItemActive(index);

        return (
            <li>
                <button type="button" role="tab"
                    id={this.formatID('carousel-tab', index)}
                    className={this.formatClass(this.props.className, {
                        'is-active': active
                    })}
                    aria-controls={this.formatID('carousel-item', index)}
                    aria-selected={active}
                    aria-expanded={active}
                    tabIndex={index}
                    onClick={this.onClick.bind(this)}>
                </button>
            </li>
        );
    }

    /**
     * Handles clicking the tab buttons.
     */
    onClick() {
        this.context.showItem(this.props.index);
    }
}

Tab.contextTypes = CONTEXT_TYPES;

/*----------------------------------------------------------------------------------------------------*/

export class TabList extends Component {
    render() {
        let children = [];

        for (let i = 0; i < this.context.itemCount; i++) {
            children.push(
                <Tab
                    index={i}
                    key={'tab-' + i}
                    className={this.props.tabClassName} />
            );
        }

        return (
            <nav className={this.formatClass(this.props.className)} data-carousel-tabs>
                <ol>
                    {children}
                </ol>
            </nav>
        );
    }
}

TabList.contextTypes = CONTEXT_TYPES;

TabList.defaultProps = {
    className: 'carousel-tabs',
    tabClassName: 'carousel-tab'
};

TabList.propTypes = {
    children: childrenOfType(Tab),
    className: PropTypes.string,
    tabClassName: PropTypes.string
};

/*----------------------------------------------------------------------------------------------------*/

export class PrevButton extends Component {
    render() {
        return (
            <button type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.onClick.bind(this)}>
                {this.props.children}
            </button>
        );
    }

    /**
     * Handles clicking the previous button.
     */
    onClick() {
        this.context.prevItem();
    }
}

PrevButton.contextTypes = CONTEXT_TYPES;

PrevButton.defaultProps = {
    className: 'carousel-prev'
};

PrevButton.propTypes = {
    className: PropTypes.string
};

/*----------------------------------------------------------------------------------------------------*/

export class NextButton extends Component {
    render() {
        return (
            <button type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.onClick.bind(this)}>
                {this.props.children}
            </button>
        );
    }

    /**
     * Handles clicking the next button.
     */
    onClick() {
        this.context.nextItem();
    }
}

NextButton.contextTypes = CONTEXT_TYPES;

NextButton.defaultProps = {
    className: 'carousel-next'
};

NextButton.propTypes = {
    className: PropTypes.string
};

/*----------------------------------------------------------------------------------------------------*/

export class StartButton extends Component {
    render() {
        return (
            <button type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.onClick.bind(this)}>
                {this.props.children}
            </button>
        );
    }

    /**
     * Handles clicking the start button.
     */
    onClick() {
        this.context.startCycle();
    }
}

StartButton.contextTypes = CONTEXT_TYPES;

StartButton.defaultProps = {
    className: 'carousel-start'
};

StartButton.propTypes = {
    className: PropTypes.string
};

/*----------------------------------------------------------------------------------------------------*/

export class StopButton extends Component {
    render() {
        return (
            <button type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.onClick.bind(this)}>
                {this.props.children}
            </button>
        );
    }

    /**
     * Handles clicking the stop button.
     */
    onClick() {
        this.context.stopCycle();
    }
}

StopButton.contextTypes = CONTEXT_TYPES;

StopButton.defaultProps = {
    className: 'carousel-stop'
};

StopButton.propTypes = {
    className: PropTypes.string
};

/*----------------------------------------------------------------------------------------------------*/

export default class Carousel extends Component {
    constructor() {
        super();

        this.timer = null;
        this.state = {
            index: 0,
            stopped: true,
            visible: 1
        };

        this.generateUID();
        this.autoBind('isItemActive', 'nextItem', 'prevItem', 'showItem', 'startCycle', 'stopCycle');
        this.onResize = debounce(this.onResize, 50);
    }

    /**
     * Render the wrapping carousel element.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props;

        return (
            <div role="tablist"
                id={this.formatID('carousel')}
                className={this.formatClass(props.className, bem(props.className, '', props.modifier), props.component, {
                    'is-stopped': this.state.stopped,
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
     * Remove events when unmounting.
     */
    componentWillUnmount() {
        clearTimeout(this.timer);

        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('resize', this.onResize);
    }

    /**
     * Emit `cycling` event before rendering.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     */
    componentWillUpdate(nextProps, nextState) {
        if (nextState.index !== this.state.index) {
            this.emitEvent('cycling', [nextState.index, this.state.index]);
        }
    }

    /**
     * Calculate dimensions once mounted.
     */
    componentDidMount() {
        this.calculateVisibleItems();
    }

    /**
     * Emit `cycled` event after rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.index !== this.state.index) {
            this.emitEvent('cycled', [this.state.index, prevState.index]);
        }
    }

    /**
     * Calculate the number of items that are visible at the same time.
     */
    calculateVisibleItems() {
        let visible = 1;

        if (this.props.modifier !== 'fade') {
            let wrapper = ReactDOM.findDOMNode(this),
                dimension = (this.props.modifier === 'slide-up') ? 'offsetHeight' : 'offsetWidth',
                child = wrapper.querySelector(`div[data-carousel-items] > ol > li`);

            if (child) {
                visible = Math.round(wrapper[dimension] / child[dimension]);
            }
        }

        this.setState({
            visible
        });
    }

    /**
     * Counts the number of children found within the `ItemList` child component.
     *
     * @returns {Number}
     */
    countItems() {
        if (this.itemCount) {
            return this.itemCount;
        }

        let count = 0;

        Children.forEach(this.props.children, child => {
            if (child.type === ItemList) {
                count = Children.count(child.props.children);
            }
        });

        return this.itemCount = count;
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

            isItemActive: this.isItemActive,
            nextItem: this.nextItem,
            prevItem: this.prevItem,
            showItem: this.showItem,
            startCycle: this.startCycle,
            stopCycle: this.stopCycle
        };
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
    isItemActive(index) {
        let currentIndex = this.state.index;

        return (index >= currentIndex && index <= (currentIndex + this.state.visible - 1));
    }

    /**
     * Cycle to the next item.
     */
    nextItem() {
        this.showItem(this.state.index + this.props.perCycle);
    }

    /**
     * Cycle to the previous item.
     */
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
    showItem(index) {
        let currentIndex = this.state.index,
            lastIndex = this.getLastIndex(),
            firstIndex = this.getFirstIndex(),
            loop = this.props.loop;

        if (this.props.infinite) {
            // TODO

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
            index: index
        });
    }

    /**
     * Start the automatic cycle timer.
     */
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
     * @param {SyntheticEvent} e
     */
    onKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft':   this.prevItem(); break;
            case 'ArrowUp':     this.showItem(this.getFirstIndex()); break;
            case 'ArrowRight':  this.nextItem(); break;
            case 'ArrowDown':   this.showItem(this.getLastIndex()); break;
            default: return;
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
    onResize() {
        this.calculateVisibleItems();
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
    reverse: false,
    onCycling: null,
    onCycled: null,
    onStart: null,
    onStop: null
};

Carousel.propTypes = {
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
    onCycling: collectionOf(PropTypes.func),
    onCycled: collectionOf(PropTypes.func),
    onStart: collectionOf(PropTypes.func),
    onStop: collectionOf(PropTypes.func)
};

Carousel.ItemList = ItemList;
Carousel.Item = Item;
Carousel.NextButton = NextButton;
Carousel.PrevButton = PrevButton;
Carousel.TabList = TabList;
Carousel.StartButton = StartButton;
Carousel.StopButton = StopButton;
