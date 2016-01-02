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
import CONTEXT_TYPES from './ContextTypes';
import { touch } from '../../../ext/flags';

export default class ItemList extends Component {
    constructor() {
        super();

        this.state = {
            index: -1, // The previous index
            phase: 0,
            translate: ''
        };
    }

    /**
     * Bind a `transitionend` listener to the list container.
     */
    componentDidMount() {
        ReactDOM.findDOMNode(this).children[0]
            .addEventListener('transitionend', this.onTransitionEnd.bind(this));
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
        /*
         let nextContext = this.context;

         // Parent index has changed, start phase 1
         if (prevState.index !== prevContext.currentIndex || nextContext.currentIndex !== prevContext.currentIndex) {
         this.setState({
         index: nextContext.currentIndex,
         phase: 1,
         translate: this.getTranslateOffset(nextContext.visibleCount)
         })
         }
         */
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
    onTransitionEnd(e) {
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
            clonedCount = context.clonedCount,
            perSide = clonedCount / 2;

        /*
         if (clonedCount && children.length >= clonedCount) {
         let firstItems = children.slice(0, perSide),
         lastItems = children.slice(-perSide),
         clone = child => {
         return React.cloneElement(child, {
         clone: true,
         key: child.key + '-clone'
         });
         };

         children.push(...firstItems.map(clone));
         children.unshift(...lastItems.map(clone));
         }
         */

        if (clonedCount && children.length >= clonedCount) {
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
        props.onSwipeRight.unshift(context.prevItem);
        props.onSwipeDown.unshift(context.prevItem);
        props.onSwipeLeft.unshift(context.nextItem);

        return (
            <div className={this.formatClass(this.props.className)} data-carousel-items={true}>
                <Swipe {...props}>
                    <ol style={{ transform: this.getTranslateOffset(context.visibleCount) }}>
                        {this.renderChildren()}
                    </ol>
                </Swipe>
            </div>
        );
    }
}

ItemList.contextTypes = CONTEXT_TYPES;

ItemList.defaultProps = {
    className: 'carousel-items',
    swipe: touch
};

ItemList.propTypes = {
    children: childrenOfType(Item),
    className: PropTypes.string,
    swipe: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    onSwipe: collectionOf.func,
    onSwipeUp: collectionOf.func,
    onSwipeRight: collectionOf.func,
    onSwipeDown: collectionOf.func,
    onSwipeLeft: collectionOf.func
};
