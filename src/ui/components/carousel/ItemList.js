/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../Component';
import Item from './Item';
import Swipe from '../../events/Swipe';
import childrenOfType from '../../../ext/prop-types/childrenOfType';
import collectionOf from '../../../ext/prop-types/collectionOf';
import cssClassName from '../../../ext/prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';
import { EVENT_NAME } from '../../../ext/events/transitionEnd';
import { TOUCH } from '../../../ext/flags';

export default class ItemList extends Component {
    constructor() {
        super();

        this.state = {
            fromIndex: 0,
            toIndex: 0,
            translate: 'none',
            reset: false
        };
    }

    /**
     * Bind a `transitionend` listener to the list container.
     */
    componentDidMount() {
        ReactDOM.findDOMNode(this).children[0]
            .addEventListener(EVENT_NAME, this.handleOnTransitionEnd.bind(this));
    }

    /**
     * When receiving a new index, determine what indices to transition from and to.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('componentWillReceiveProps', nextContext);

        this.setState({
            fromIndex: this.state.toIndex, // Previous index is the from
            toIndex: nextContext.currentIndex,
            translate: this.getTranslateOffset(nextContext.currentIndex),
            reset: nextContext.infiniteScroll
        });
    }

    /**
     * Once the parent component has updated, we must re-render this component with the new children.
     * To do this, we must disable transitions temporarily.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     * @param {Object} prevContext
     */
    componentDidUpdate(prevProps, prevState, prevContext) {

    }

    /**
     * Calculate the size to cycle with based on the sum of all items up to but not including the defined index.
     *
     * @param {Number} index
     * @returns {String}
     */
    getTranslateOffset(index) {
        let modifier = this.context.modifier,
            offset = index * (100 / this.context.visibleCount),
            x = (modifier === 'slide') ? -offset : 0,
            y = (modifier === 'slide-up') ? -offset : 0;

        return (modifier === 'fade') ? 'none' : `translate3d(${x}%, ${y}%, 0)`;
    }

    /**
     * Callback to trigger once the containers animation finishes.
     * Emit `cycled` event after transitioning.
     *
     * @param {TransitionEvent} e
     */
    handleOnTransitionEnd(e) {
        if (e.propertyName === 'transform') {
            this.context.afterAnimation();
        }
    }

    /**
     * Render the items into the carousel item list.
     *
     * TODO
     *
     * @returns {Array}
     */
    renderChildren() {
        let children = Children.toArray(this.props.children),
            visibleChildren = [],
            context = this.context,
            itemCount = context.itemCount,
            perSide = context.visibleCount;

        // We can simply use all children if we don't have to support infinite scrolling
        if (!context.infiniteScroll) {
            return children;
        }

        if (children.length) {
            let startIndex = context.currentIndex - perSide,
                endIndex = context.currentIndex + context.visibleCount + perSide;

            // Extract from the end
            if (startIndex < 0) {
                visibleChildren.push(...children.slice(startIndex));
                startIndex = 0;
            }

            // Extract normally
            visibleChildren.push(...children.slice(startIndex, endIndex));

            // Extract from the beginning
            if (endIndex >= itemCount) {
                visibleChildren.push(...children.slice(0, (endIndex - itemCount)));
            }

        } else {
            visibleChildren = children;
        }

        return visibleChildren;
    }

    render() {
        let context = this.context,
            props = this.generateNestedProps(this.props, 'swipe', [
                'onSwipe', 'onSwipeUp', 'onSwipeRight', 'onSwipeDown', 'onSwipeLeft'
            ]);

        // Trigger our listeners first
        props.onSwipeUp.unshift(context.nextItem);
        props.onSwipeLeft.unshift(context.nextItem);
        props.onSwipeDown.unshift(context.prevItem);
        props.onSwipeRight.unshift(context.prevItem);

        console.log('CHILD RENDER');

        return (
            <div className={this.formatClass(this.props.className, {
                    'no-transition': this.state.reset
                })}>
                <Swipe {...props}>
                    <ol style={{ transform: this.state.translate }}>
                        {this.renderChildren()}
                    </ol>
                </Swipe>
            </div>
        );
    }
}

ItemList.contextTypes = CONTEXT_TYPES;

ItemList.defaultProps = {
    className: ['carousel', 'items'],
    swipe: TOUCH
};

ItemList.propTypes = {
    children: childrenOfType(Item),
    className: cssClassName.isRequired,
    swipe: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    onSwipe: collectionOf.func,
    onSwipeUp: collectionOf.func,
    onSwipeRight: collectionOf.func,
    onSwipeDown: collectionOf.func,
    onSwipeLeft: collectionOf.func
};
