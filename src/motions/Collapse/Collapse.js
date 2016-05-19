/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import Component from '../../Component';
import debounce from 'lodash/debounce';
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
        onRest: PropTypes.func,
        style: PropTypes.object
    };

    constructor() {
        super();

        this.state = {
            size: 0,
            calculate: true,
            changed: false
        };

        this.handleOnResize = debounce(this.handleOnResize.bind(this), 100);
    }

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
        this.calculateSize();
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
     * Only update when the we need to calculate or expand.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextState.calculate !== this.state.calculate ||
            nextState.size !== this.state.size ||
            nextProps.expanded !== this.props.expanded
        );
    }

    /**
     * Re-calculate the size if the `calculate` state is true.
     */
    componentDidUpdate() {
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
     */
    calculateSize() {
        if (this.state.calculate) {
            this.setState({
                size: this.element.getBoundingClientRect()[this.props.direction],
                calculate: false
            });
        }
    }

    /**
     * When the browser is resized, re-calculate the element width or height.
     */
    handleOnResize() {
        this.setState({
            calculate: true
        });
    }

    /**
     * Determine the size to animate too, and whether to trigger animations for it.
     *
     * @returns {Object|Number}
     */
    getMotionSize() {
        let { size, changed } = this.state,
            { expanded, fixedAt, motion } = this.props,
            expandedSize = expanded ? (fixedAt || size) : 0;

        return changed ? spring(expandedSize, motion) : expandedSize;
    }

    /**
     * Render a wrapper that triggers collapsible content animations.
     * Requires a literal size of the element to work correctly.
     *
     * @returns {ReactElement}
     */
    render() {
        let { calculate } = this.state,
            { children, direction, expanded, style, onRest, ...props } = this.props;

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

        if (calculate) {
            return (
                <div style={{ [direction]: 'auto' }}>
                    {content}
                </div>
            );
        }

        return (
            <Motion
                defaultStyle={{ [direction]: 0 }}
                style={{ [direction]: this.getMotionSize() }}
                onRest={onRest}
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
