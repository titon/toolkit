/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Titon from '../../Titon';
import Component from './Component';
import childrenOfType from '../../ext/prop-types/childrenOfType';
import collectionOf from '../../ext/prop-types/collectionOf';

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

        this.state = {
            index: -1,
            stopped: false
        };
    }

    render() {
        let props = this.props;

        return (
            <div role="tablist"
                id={this.formatID('carousel')}
                className={this.formatClass(props.className, props.animation, props.component, {
                    'is-stopped': this.state.stopped
                })}
                aria-live={props.autoCycle ? 'assertive' : 'off'}
                onKeyDown={this.onKeyDown.bind(this)}>

                <div className={this.formatClass(props.itemsClassName)}>
                    <ol>
                        {props.children}
                    </ol>
                </div>

                <nav className={this.formatClass(props.tabsClassName)}>
                    <ol>
                        {Children.map(props.children, this.renderTab.bind(this))}
                    </ol>
                </nav>

                <button type="button" role="button"
                    className={this.formatClass(props.prevClassName)}
                    onClick={this.onClickPrev.bind(this)}>
                    {props.prev}
                </button>

                <button type="button" role="button"
                    className={this.formatClass(props.nextClassName)}
                    onClick={this.onClickNext.bind(this)}>
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

    componentWillMount() {
        this.showItem(this.props.defaultIndex);

        window.addEventListener('keydown', this.onKeyDown.bind(this));
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

    next() {
        this.showItem(this.state.index + this.props.itemsToCycle);
    }

    prev() {
        this.showItem(this.state.index - this.props.itemsToCycle);
    }

    showItem(index) {

    }

    start() {
        this.setState({
            stopped: false
        });

        this.emitEvent('start');
    }

    stop() {
        this.setState({
            stopped: true
        });

        this.emitEvent('stop');
    }

    onClickTab(index) {
        this.showItem(index);
    }

    onClickNext() {
        this.next();
    }

    onClickPrev() {
        this.prev();
    }

    onKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft':   this.prev(); break;
            case 'ArrowUp':     this.jump(0); break;
            case 'ArrowRight':  this.next(); break;
            case 'ArrowDown':   this.jump(-1); break;
            default: return;
        }

        e.preventDefault();
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
    autoCycle: true,
    stopOnHover: true,
    infinite: true,
    loop: true,
    reverse: false,
    rtl: Titon.flags.rtl,
    swipe: Titon.flags.touch,
    itemsToShow: 1,
    itemsToCycle: 1,
    defaultIndex: 0
};

Carousel.propTypes = {
    children: childrenOfType(CarouselItem),
    component: PropTypes.string,
    className: PropTypes.string,
    itemsClassName: PropTypes.string,
    tabsClassName: PropTypes.string,
    prevClassName: PropTypes.string,
    nextClassName: PropTypes.string,
    prev: PropTypes.node,
    next: PropTypes.node,
    animation: PropTypes.oneOf(['slide', 'slide-up', 'fade']),
    duration: PropTypes.number,
    autoCycle: PropTypes.bool,
    stopOnHover: PropTypes.bool,
    infinite: PropTypes.bool,
    loop: PropTypes.bool,
    reverse: PropTypes.bool,
    rtl: PropTypes.bool,
    swipe: PropTypes.bool,
    itemsToShow: PropTypes.number,
    itemsToCycle: PropTypes.number,
    defaultIndex: PropTypes.number
};

Carousel.Item = CarouselItem;
