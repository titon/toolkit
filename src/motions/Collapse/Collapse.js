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
        console.log('componentDidMount');
        this.calculateSize(); // eslint-disable-line react/no-did-mount-set-state
    }

    /**
     * Keep track on whether this component has been expanded before.
     *
     * @param {Boolean} expanded
     */
    componentWillReceiveProps({ expanded }) {
        console.log('componentWillReceiveProps', expanded);
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
        let foo = (
            nextState.calculate ||
            nextState.size !== this.state.size ||
            nextProps.expanded !== this.props.expanded
        );

        console.log('shouldComponentUpdate', foo);

        return foo;
    }

    /**
     * Re-calculate the size if the `calculate` state is true.
     */
    componentDidUpdate() {
        console.log('componentDidUpdate');
        this.calculateSize();
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
        if (this.state.calculate) {
            console.log('calculateSize', this.state.calculate,
                this.element.getBoundingClientRect()[this.props.direction],
                this.element, this.element.parentNode);

            this.setState({
                size: this.element.getBoundingClientRect()[this.props.direction],
                calculate: false
            });
        }
    }

    /**
     * When the browser is resized, re-calculate the element width or height.
     */
    @bind
    @debounce(100)
    handleOnResize() {
        console.log('resize');
        this.setState({
            calculate: true
        });
    }

    getDefaultSize() {
        let state = this.state,
            props = this.props,
            size = props.fixedAt || state.size;

        return props.expanded ? 0 : size;
    }

    /**
     * Determine the size to animate too, and whether to trigger animations for it.
     *
     * @returns {Object}
     */
    getMotionSize() {
        let state = this.state,
            props = this.props,
            size = props.fixedAt || state.size,
            expandedSize = props.expanded ? size : 0;

        // Or if the component has not been expanded before
        if (!state.changed) {
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
        let { calculate } = this.state,
            { children, direction, expanded, style, ...props } = this.props;

        const content = (
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

        console.log('render', calculate, this.getDefaultSize(), this.getMotionSize());

        if (calculate) {
            return (
                <div style={{ [direction]: 'auto' }}>
                    {content}
                </div>
            );
        }

        return (
            <Motion
                defaultStyle={{ [direction]: this.getDefaultSize() }}
                style={{ [direction]: this.getMotionSize() }}
            >
                {motionStyle => {
                    console.log('render motion', motionStyle);
                    return React.cloneElement(content, {
                        style: {
                            ...style,
                            ...motionStyle,
                            overflow: 'hidden'
                        }
                    });
                }}
            </Motion>
        );
    }
}
