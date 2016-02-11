/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
import Swipe from '../../events/Swipe';
import bind from '../../decorators/bind';
import childrenOfType from '../../prop-types/childrenOfType';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';
import { TOUCH } from '../../flags';

export default class OffCanvas extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['off-canvas'],
        animation: 'push',
        openOnLoad: false,
        stopScroll: true,
        swipe: TOUCH
    };

    static propTypes = {
        children: childrenOfType(MainContent, Sidebar),
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
        animation: PropTypes.oneOf([
            'push', 'push-reveal', 'push-down', 'reverse-push',
            'reveal', 'on-top', 'squish'
        ]),
        openOnLoad: PropTypes.bool,
        stopScroll: PropTypes.bool,
        swipe: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
    };

    state = {
        sides: new Set() // Use a set so we can support multiple sidebars at some point
    };

    /**
     * Generate a UID.
     */
    constructor() {
        super();

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
            activeSides: Array.from(this.state.sides),
            isSideActive: this.isSideActive,
            hideSide: this.hideSide,
            showSide: this.showSide
        };
    }

    /**
     * Only update if the active sides change.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.sides !== this.state.sides);
    }

    /**
     * Conceal a sidebar by removing its side from the active list.
     *
     * @param {String} side
     */
    @bind
    hideSide(side) {
        let sides = new Set(this.state.sides);

        sides.delete(side);

        this.setState({
            sides
        });
    }

    /**
     * Returns true if the defined side is currently active.
     *
     * @param {String} side
     * @returns {Boolean}
     */
    @bind
    isSideActive(side) {
        return this.state.sides.has(side);
    }

    /**
     * Reveal a sidebar by adding the `side` to the active list.
     *
     * @param {String} side
     */
    @bind
    showSide(side) {
        let sides = new Set(this.state.sides);

        if (sides.has('left') && side === 'right') {
            sides.delete('left');

        } else if (sides.has('right') && side === 'left') {
            sides.delete('right');

        } else {
            sides.add(side);
        }

        this.setState({
            sides
        });
    }

    /**
     * Handles all `swipe` events by toggling the display of sidebars
     * based on the direction of the swipe.
     *
     * @param {Event} e
     */
    @bind
    handleOnSwipe(e) {
        this.showSide(e.detail.direction === 'right' ? 'left' : 'right');
    }

    /**
     * Render the off canvas container.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props,
            swipeProps = this.generateNestedProps(props, 'swipe', [
                'onSwipe', 'onSwipeUp', 'onSwipeRight', 'onSwipeDown', 'onSwipeLeft'
            ]);

        // Trigger our listeners first
        swipeProps.onSwipeLeft.unshift(this.handleOnSwipe);
        swipeProps.onSwipeRight.unshift(this.handleOnSwipe);

        return (
            <Swipe {...swipeProps}>
                <div
                    id={this.formatID('off-canvas')}
                    className={this.formatClass(props.className, {
                        [props.animation]: true,
                        'move-left': this.isSideActive('right'),
                        'move-right': this.isSideActive('left')
                    })}
                    {...this.inheritNativeProps(props)}>

                    {props.children}
                </div>
            </Swipe>
        );
    }
}
