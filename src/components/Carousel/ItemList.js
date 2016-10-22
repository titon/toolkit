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
import bind from '../../decorators/bind';
import childrenOf from '../../prop-types/childrenOf';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';
import { TOUCH } from '../../flags';

export default class ItemList extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static defaultProps = {
    swipe: TOUCH,
  };

  static propTypes = {
    children: childrenOf(Item),
    swipe: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    onSwipe: collectionOf.func,
    onSwipeUp: collectionOf.func,
    onSwipeRight: collectionOf.func,
    onSwipeDown: collectionOf.func,
    onSwipeLeft: collectionOf.func,
  };

  state = {
    fromIndex: 0,
    toIndex: 0,
    translate: 'none',
    reset: false,
    phase: 'initialRender',
  };

    /**
     * Calculate the initial transform translate offset before rendering.
     */
  componentWillMount() {
    console.log('componentWillMount');

    this.setState({
      translate: this.getTranslateOffset(),
    });
  }

    /**
     * When receiving a new index, determine what indices to transition from and to.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
  componentWillReceiveProps(nextProps, nextContext) {
    console.log('componentWillReceiveProps'); // , nextContext);

        // Phase 1) Rebuild the children before the transition starts
    if (nextContext.currentIndex !== this.state.toIndex) {
      console.log('PHASE', 'beforeTransition', nextContext.currentIndex);

      this.setState({
        fromIndex: this.state.toIndex, // Previous index is now the from
        toIndex: nextContext.currentIndex,
        translate: 'none',
        reset: false,
        phase: 'beforeTransition',
      });

        // Phase 3) Rebuild the children after the transition finishes
    } else if (nextContext.currentIndex === this.state.toIndex && this.state.phase === 'startTransition') {
      console.log('PHASE', 'afterTransition');

      this.setState({
        fromIndex: this.state.toIndex,
        translate: 'none',
        reset: true,
        phase: 'afterTransition',
      });
    }
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
    console.log('componentDidUpdate');

        // Phase 2) Start the transition by setting a new translate offset
    if (this.state.phase === 'beforeTransition') {
      console.log('PHASE', 'startTransition', this.state.toIndex);

      this.setState({
        translate: this.getTranslateOffset(),
        phase: 'startTransition',
      });
    }
  }

    /**
     * Calculate the size to cycle with based on the sum of all items up to but not including the defined index.
     *
     * @returns {String}
     */
  getTranslateOffset() {
    let index = 0,
      fromIndex = this.state.fromIndex,
      toIndex = this.state.toIndex,
      context = this.getContext(),
      modifier = context.modifier;

    if (modifier === 'fade') {
      return 'none';
    }

    if (toIndex > fromIndex) {
      index = toIndex - fromIndex;
    } else if (toIndex < fromIndex) {
      index = context.itemCount - fromIndex + toIndex;
    } else {
      index = toIndex;
    }

    let offset = index * (100 / context.visibleCount),
      x = (modifier === 'slide') ? -offset : 0,
      y = (modifier === 'slide-up') ? -offset : 0;

    return `translate3d(${x}%, ${y}%, 0)`;
  }

    /**
     * Callback to trigger once the containers animation finishes.
     * Emit `cycled` event after transitioning.
     *
     * @param {TransitionEvent} e
     */
    @bind
  handleOnTransitionEnd(e) {
    if (e.propertyName === 'transform') {
      this.getContext().afterAnimation();
    }
  }

    /**
     * Render a specific range of items into the carousel item list.
     *
     * @returns {*[]}
     */
  renderChildren() {
    let children = Children.toArray(this.props.children),
      visibleChildren = [],
      fromIndex = this.state.fromIndex,
      toIndex = this.state.toIndex + this.getContext().visibleCount;

    console.log('RENDER CHILDREN', fromIndex, toIndex);

        // From beginning to end: 2 - 9
    if (toIndex > fromIndex) {
      visibleChildren.push(...children.slice(fromIndex, toIndex + 1));

        // From end that loops around to the beginning: 6 - 1
    } else if (toIndex < fromIndex) {
      visibleChildren.push(...children.slice(fromIndex));
      visibleChildren.push(...children.slice(0, toIndex + 1));

        // How did this happen?
    } else {
      visibleChildren = children;
    }

    return visibleChildren;
  }

    /**
     * Render the item list and attach swipe and transition functionality to the `ol` tag.
     *
     * @returns {ReactElement}
     */
  render() {
    let context = this.getContext(),
      props = this.generateNestedProps(this.props, 'swipe', [
        'onSwipe', 'onSwipeUp', 'onSwipeRight', 'onSwipeDown', 'onSwipeLeft',
      ]);

        // Trigger our listeners first
    props.onSwipeUp.unshift(context.nextItem);
    props.onSwipeLeft.unshift(context.nextItem);
    props.onSwipeDown.unshift(context.prevItem);
    props.onSwipeRight.unshift(context.prevItem);

    return (
      <div className={this.formatChildClass('item-list')}>
        <Swipe {...props}>
          <ol style={{ transform: this.state.translate }}
            className={this.state.reset ? 'no-transition' : ''}
            onTransitionEnd={this.handleOnTransitionEnd}
          >
            {this.renderChildren()}
          </ol>
        </Swipe>
      </div>
        );
  }
}
