/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Titon from '../../Titon';
import Component from './Component';
import childrenOfType from '../../ext/prop-types/childrenOfType';
import collectionOf from '../../ext/prop-types/collectionOf';
import inChildRange from '../../ext/prop-types/inChildRange';
import debounce from 'lodash/function/debounce';

const CONTEXT_TYPES = {
    uid: PropTypes.string,
    isItemActive: PropTypes.func
};

/*----------------------------------------------------------------------------------------------------*/

export class CarouselItem extends Component {
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

CarouselItem.contextTypes = CONTEXT_TYPES;

CarouselItem.defaultProps = {
    className: 'carousel-item',
    index: -1
};

CarouselItem.propTypes = {
    className: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired
};

/*----------------------------------------------------------------------------------------------------*/

export class CarouselTab extends Component {
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
                    onClick={this.props.onClick}>
                </button>
            </li>
        );
    }
}

CarouselTab.contextTypes = CONTEXT_TYPES;

/*----------------------------------------------------------------------------------------------------*/

export default class Carousel extends Component {
    constructor() {
        super();

        this.timer = null;
        this.state = {
            index: 0,
            stopped: false,
            dimension: '',
            sizes: [],
            visible: 1
        };

        this.generateUID();
        this.autoBind('renderTab', 'isItemActive');
        this.onResize = debounce(this.onResize, 50);
    }

    render() {
        let props = this.props,
            state = this.state;

        return (
            <div role="tablist"
                id={this.formatID('carousel')}
                className={this.formatClass(props.className, props.animation, props.component, {
                    'is-stopped': this.state.stopped,
                    'no-next': (!props.loop && this.isAtLast()),
                    'no-prev': (!props.loop && this.isAtFirst())
                })}
                aria-live={props.autoCycle ? 'assertive' : 'off'}
                onKeyDown={this.onKeyDown}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}>

                <div className={this.formatClass(props.itemsClassName)}>
                    <ol style={{ transform: this.getTranslateOffset(state.index) }}>
                        {props.children}
                    </ol>
                </div>

                <nav className={this.formatClass(props.tabsClassName)}>
                    <ol>
                        {Children.map(props.children, this.renderTab)}
                    </ol>
                </nav>

                <button type="button" role="button"
                    className={this.formatClass(props.prevClassName)}
                    onClick={this.onClickPrev}>
                    {props.prev}
                </button>

                <button type="button" role="button"
                    className={this.formatClass(props.nextClassName)}
                    onClick={this.onClickNext}>
                    {props.next}
                </button>
            </div>
        );
    }

    renderTab(child, index) {
        return (
            <CarouselTab
                index={index}
                key={'tab-' + index}
                className={this.props.tabClassName}
                onClick={this.onClickTab.bind(this, index)} />
        );
    }

    /**
     * Before mounting, validate and correct specific props,
     * and setup the initial state.
     */
    componentWillMount() {
        switch (this.props.animation) {
            case 'slide-up':
                this.setState({
                    dimension: 'clientHeight'
                });
                break;

            case 'slide':
                this.setState({
                    dimension: 'clientWidth'
                });
                break;
        }

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
        clearInterval(this.timer);

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
        this.emitEvent('cycling', [nextState.index, this.state.index]);
    }

    /**
     * Calculate dimensions once mounted.
     */
    componentDidMount() {
        this.calculateSizes();
    }

    /**
     * Emit `cycled` event after rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        this.emitEvent('cycled', [this.state.index, prevState.index]);
    }

    /**
     * Calculate the width or height of each item to use for the transition animation.
     */
    calculateSizes() {
        let wrapper = ReactDOM.findDOMNode(this),
            visible = 1,
            sizes = Array.from(wrapper.querySelectorAll(`.${this.props.itemsClassName} > ol > li`), child => {
                return {
                    size: child[this.state.dimension],
                    clone: child.classList.contains('is-cloned')
                };
            });

        if (sizes.length) {
            visible = Math.round(wrapper[this.state.dimension] / sizes[0].size);
        }

        this.setState({
            sizes,
            visible
        });
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            uid: this.uid,
            isItemActive: this.isItemActive
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
        return (Children.count(this.props.children) - this.state.visible);
    }

    /**
     * Determine the new index to cycle to while taking in account all props and settings.
     *
     * @param {Number} index
     * @returns {Number}
     */
    getNewIndex(index) {
        let currentIndex = this.state.index,
            lastIndex = this.getLastIndex(),
            firstIndex = this.getFirstIndex();

        if (this.props.infinite) {
            // TODO

        } else {
            // If cycle exceeds the last visible item
            if (index > lastIndex) {
                index = this.props.loop ? firstIndex + (index - lastIndex - 1) : lastIndex;

            // If cycle proceeds the first visible item
            } else if (index < firstIndex) {
                index = this.props.loop ? lastIndex + index + 1 : firstIndex;
            }
        }

        return index;
    }

    /**
     * Calculate the size to cycle with based on the sum of all items up to but not including the defined index.
     *
     * @param {Number} index    - Includes the clone index
     * @returns {String}
     */
    getTranslateOffset(index) {
        if (this.props.animation === 'fade') {
            return 'translate(0, 0);';
        }

        let sum = 0;

        this.state.sizes.forEach((value, i) => {
            if (i < index) {
                sum += value.size;
            }
        });

        if (this.props.animation === 'slide-up') {
            return `translateY(-${sum}px)`;
        }

        return `translateX(-${sum}px)`;
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
        clearInterval(this.timer);

        if (this.props.autoCycle) {
            this.timer = setInterval(this.onCycle, this.props.duration);
        }
    }

    /**
     * Cycle to the item at the specified index.
     *
     * @param {Number} index
     */
    showItem(index) {
        index = this.getNewIndex(index);

        this.resetCycle();

        // Break out early if the same index
        if (this.state.index === index) {
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
        this.setState({
            stopped: false
        });

        this.emitEvent('start');
    }

    /**
     * Stop the automatic cycle timer.
     */
    stopCycle() {
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
     * Handles clicking the tab buttons.
     *
     * @param {Number} index
     */
    onClickTab(index) {
        this.showItem(index);
    }

    /**
     * Handles clicking the next button.
     */
    onClickNext() {
        this.nextItem();
    }

    /**
     * Handles clicking the previous button.
     */
    onClickPrev() {
        this.prevItem();
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
        if (this.props.stopOnHover) {
            this.stopCycle();
        }
    }

    /**
     * Start the cycle when exiting the carousel.
     */
    onMouseLeave() {
        if (this.props.stopOnHover) {
            this.startCycle();
        }
    }

    /**
     * Re-calculate dimensions in case the element size has changed.
     */
    onResize() {
        this.calculateSizes();
    }
}

Carousel.childContextTypes = CONTEXT_TYPES;

Carousel.defaultProps = {
    className: 'carousel',
    itemsClassName: 'carousel-items',
    tabClassName: 'carousel-tab',
    tabsClassName: 'carousel-tabs',
    prevClassName: 'carousel-prev',
    nextClassName: 'carousel-next',
    animation: 'slide',
    duration: 5000,
    perCycle: 1,
    defaultIndex: 0,
    autoCycle: true,
    stopOnHover: true,
    infinite: true,
    loop: true,
    reverse: false,
    swipe: Titon.flags.touch
};

Carousel.propTypes = {
    children: childrenOfType(CarouselItem),
    component: PropTypes.string,
    className: PropTypes.string,
    itemsClassName: PropTypes.string,
    tabClassName: PropTypes.string,
    tabsClassName: PropTypes.string,
    prevClassName: PropTypes.string,
    nextClassName: PropTypes.string,
    prev: PropTypes.node,
    next: PropTypes.node,
    animation: PropTypes.oneOf(['slide', 'slide-up', 'fade']),
    duration: PropTypes.number,
    perCycle: inChildRange,
    defaultIndex: inChildRange,
    autoCycle: PropTypes.bool,
    stopOnHover: PropTypes.bool,
    infinite: PropTypes.bool,
    loop: PropTypes.bool,
    reverse: PropTypes.bool,
    swipe: PropTypes.bool
};

Carousel.Item = CarouselItem;
