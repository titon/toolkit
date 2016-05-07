/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import Component from '../../Component';
import bind from '../../decorators/bind';
import debounce from '../../decorators/debounce';
import { motionSpring } from '../../propTypes';
import MODULE from './module';

export default class Collapse extends Component {
    static module = MODULE;

    static defaultProps = {
        direction: 'height',
        expanded: true,
        motion: {
            stiffness: 210,
            damping: 20
        },
        style: {}
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        direction: PropTypes.oneOf(['width', 'height']),
        expanded: PropTypes.bool.isRequired,
        fixedAt: PropTypes.number,
        motion: motionSpring,
        style: PropTypes.object
    };

    state = {
        size: 0,
        calculate: true,
        changed: false
    };

    /**
     * Bind events.
     */
    componentWillMount() {
        window.addEventListener('resize', this.handleOnResize);
    }

    /**
     * Calculate the initial width or height on first render.
     */
    componentDidMount() {
        /* eslint-disable react/no-did-mount-set-state */
        this.setState({
            size: this.calculateSize(),
            calculate: false
        });
    }

    /**
     * Keep track on whether this component has been expanded before.
     *
     * @param {Boolean} expanded
     */
    componentWillReceiveProps({ expanded }) {
        this.setState({
            changed: (expanded !== this.props.expanded)
        });
    }

    /**
     * Only update when the size or expanded prop changes.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.expanded !== this.props.expanded || nextState.size !== this.state.size);
    }

    /**
     * Unbind events.
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleOnResize);
    }

    /**
     * Calculate the width or height of the element using the bounding box.
     *
     * @returns {Number}
     */
    calculateSize() {
        return this.element.getBoundingClientRect()[this.props.direction];
    }

    /**
     * When the browser is resized, re-calculate the element width or height.
     */
    @bind
    @debounce(100)
    handleOnResize() {
        // TODO
        this.setState({
            size: this.calculateSize()
        });
    }

    /**
     * Determine the size to animate too, and whether to trigger animations for it.
     *
     * @returns {Number}
     */
    getMotionSize() {
        let state = this.state,
            props = this.props,
            expandedSize = props.expanded ? (props.fixedAt || state.size) : 0;

        // Don't animation if we need to calculate
        // Or if the component has not been expanded before
        if (state.calculate || !state.changed) {
            return expandedSize;
        }

        return spring(expandedSize, props.motion);
    }

    /**
     * Render the wrapper that triggers slide collapse transitions.
     * Requires a literal size of the element to work correctly.
     *
     * @returns {ReactElement}
     */
    render() {
        let { calculate, size } = this.state,
            { children, direction, expanded, fixedAt, style, ...props } = this.props,
            content = (
                <div
                    ref={this.handleRef}
                    className={this.formatClass({
                        ['@' + direction]: true,
                        'is-expanded': expanded
                    })}
                    {...this.inheritNativeProps(props)}
                >
                    {children}
                </div>
            );

        // We need to calculate the height or width (mainly on the initial render)
        // So don't wrap in a motion yet
        if (calculate && !fixedAt) {
            return (
                <div style={{ overflow: 'hidden', visibility: 'hidden', [direction]: 'auto' }}>
                    {content}
                </div>
            );
        }

        return (
            <Motion
                defaultStyle={{ [direction]: expanded ? 0 : size }}
                style={{ [direction]: this.getMotionSize() }}
            >
                {motionStyle => React.cloneElement(content, {
                    style: {
                        ...style,
                        ...motionStyle,
                        overflow: 'hidden'
                    }
                })}
            </Motion>
        );
    }
}
