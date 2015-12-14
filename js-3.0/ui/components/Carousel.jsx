import React from 'react';
import Titon from 'Titon';
import classBuilder from 'extensions/utility/classBuilder';

export default class Carousel extends React.Component {
    constructor() {
        super();

        this.version = '3.0.0';

        this.state = {
            items: [],

            /** Currently displayed item by index. */
            index: this.props.defaultIndex,

            /** Is the carousel currently animating? */
            animating: false,

            /** Is the carousel stopped or paused? */
            stopped: false
        };

        /** The dimension (width or height) to read sizes from. */
        this.dimension = '';

        /** The position (left, right, or top) to modify for cycling. */
        this.position = '';

        /** The size (width/height, margin) of each item. */
        this.sizes = [];
    }

    render() {
        let className = classBuilder({
            carousel: true,
            [this.props.animation]: true
        });

        return (
            <div class={className} aria-live={this.props.autoCycle ? 'assertive' : 'off'}>
                <div class="carousel-items">
                    <ul>
                        <li></li>
                    </ul>
                </div>

                <div class="carousel-tabs" role="tablist">
                    <ol class="bullets">
                        <li></li>
                    </ol>
                </div>

                <button type="button" role="button" class="carousel-prev" onClick={this.onClickPrev.bind(this)}>

                </button>

                <button type="button" role="button" class="carousel-next" onClick={this.onClickNext.bind(this)}>

                </button>
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            likesIncreasing: nextProps.index
        });
    }

    onClickHeader(index, e) {

    }
}

Carousel.defaultProps = {
    animation: 'slide',
    duration: 5000,
    autoCycle: true,
    stopOnHover: true,
    infinite: true,
    loop: true,
    reverse: false,
    rtl: Toolkit.isRTL,
    swipe: Toolkit.isTouch,
    itemsToShow: 1,
    itemsToCycle: 1,
    defaultIndex: 0
};

Carousel.propTypes = {
    animation: React.PropTypes.oneOf(['slide', 'slide-up', 'fade']),
    duration: React.PropTypes.number,
    autoCycle: React.PropTypes.bool,
    stopOnHover: React.PropTypes.bool,
    infinite: React.PropTypes.bool,
    loop: React.PropTypes.bool,
    reverse: React.PropTypes.bool,
    rtl: Titon.isRTL,
    swipe: Titon.isTouch,
    itemsToShow: React.PropTypes.number,
    itemsToCycle: React.PropTypes.number,
    defaultIndex: React.PropTypes.number
};

/*----------------------------------------------------------------------------------------------------*/

export class CarouselItem extends React.Component {
    render() {
        return (
            <li role="tabpanel" aria-hidden={this.props.currentIndex > 0}>
                {this.props.children}
            </li>
        );
    }
}

Carousel.Item = CarouselItem;
