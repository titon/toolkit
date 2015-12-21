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
import debounce from 'lodash/function/debounce';

const CONTEXT_TYPES = {
    uid: PropTypes.string
};

/*----------------------------------------------------------------------------------------------------*/

export class CarouselItem extends Component {
    render() {
        return (
            <li role="tabpanel"
                id={this.formatID('carousel-item', this.props.index)}
                aria-hidden={false}>

                {this.props.children}
            </li>
        );
    }
}

CarouselItem.contextTypes = CONTEXT_TYPES;

CarouselItem.defaultProps = {
    index: -1
};

CarouselItem.propTypes = {
    index: PropTypes.number.isRequired
};

/*----------------------------------------------------------------------------------------------------*/

export class CarouselTab extends Component {
    render() {
        let index = this.props.index;

        return (
            <li>
                <button type="button" role="tab"
                    id={this.formatID('carousel-tab', index)}
                    className={this.formatClass(this.props.className)}
                    aria-controls={this.formatID('carousel-item', index)}
                    aria-selected={false}
                    aria-expanded={false}
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
            index: -1,
            stopped: false,
            dimension: '',
            position: '',
            sizes: []
        };

        this.generateUID();
        this.autoBind('renderTab');
        this.onResize = debounce(this.onResize, 50);
    }

    render() {
        let props = this.props,
            state = this.state;

        return (
            <div role="tablist"
                id={this.formatID('carousel')}
                className={this.formatClass(props.className, props.animation, props.component, {
                    'is-stopped': this.state.stopped
                })}
                aria-live={props.autoCycle ? 'assertive' : 'off'}
                onKeyDown={this.onKeyDown}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}>

                <div className={this.formatClass(props.itemsClassName)}>
                    <ol style={{ transform: `translateX(-${this.getTranslateOffset(state.index)}px)` }}>
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
        var props = this.props;

        // Cycling more than the children amount causes unexpected issues
        // TODO
        if (props.perCycle > Children.count(props.children)) {
            props.perCycle = Children.count(props.children);
        }

        // Fade animations can only display 1 at a time
        switch (this.props.animation) {
            case 'fade':
                props.perCycle = 1;
                props.infinite = false;
                break;

            case 'slide-up':
                this.setState({
                    dimension: 'height',
                    position: 'top'
                });
                break;

            case 'slide':
                this.setState({
                    dimension: 'width',
                    position: props.rtl ? 'right' : 'left'
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
     * Only update if item indices are different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.index !== this.state.index);
    }

    /**
     * Calculate the width or height of each item to use for the transition animation.
     */
    calculateSizes() {
        let sizes = Array.from(ReactDOM.findDOMNode(this).querySelectorAll(`.${this.props.itemsClassName} > ol > li`), child => {
            return {
                size: (this.state.dimension === 'height') ? child.clientHeight : child.clientWidth,
                clone: child.classList.contains('is-cloned')
            };
        });

        this.setState({
            sizes: sizes
        });
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            uid: this.uid
        };
    }

    /**
     * Calculate the size to cycle with based on the sum of all items up to but not including the defined index.
     *
     * @param {Number} index    - Includes the clone index
     * @returns {Number}
     */
    getTranslateOffset(index) {
        let sum = 0;

        this.state.sizes.forEach((value, i) => {
            if (i < index) {
                sum += value.size;
            }
        });

        return sum;
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
        let total = Children.count(this.props.children);

        if (index < 0) {
            index = total + index;
        } else if (index >= total) {
            index = 0;
        }

        this.resetCycle();
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
            case 'ArrowUp':     this.showItem(0); break;
            case 'ArrowRight':  this.nextItem(); break;
            case 'ArrowDown':   this.showItem(-1); break;
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
    rtl: Titon.flags.rtl,
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
    perCycle: PropTypes.number,
    defaultIndex: PropTypes.number,
    autoCycle: PropTypes.bool,
    stopOnHover: PropTypes.bool,
    infinite: PropTypes.bool,
    loop: PropTypes.bool,
    reverse: PropTypes.bool,
    rtl: PropTypes.bool,
    swipe: PropTypes.bool
};

Carousel.Item = CarouselItem;
