/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../Component';
import Tooltip from './Tooltip';
import bind from '../../decorators/bind';
import invariant from '../../utility/invariant';
import MODULE from './module';
import GATEWAY_CONTEXT_TYPES from '../Gateway/contextTypes';
import { contextKey } from '../Gateway/module';

export default class Warp extends Component {
    static module = MODULE;

    static contextTypes = GATEWAY_CONTEXT_TYPES;

    static defaultProps = {
        mode: 'hover'
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        gateName: PropTypes.string.isRequired,
        mode: PropTypes.oneOf(['click', 'hover']),
        tooltip: PropTypes.oneOfType([PropTypes.element, PropTypes.node]).isRequired
    };

    state = {
        element: null,
        visible: false
    };

    /**
     * Validate that a tooltip is instantiated within a gateway.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super();

        invariant(typeof context[contextKey] !== 'undefined',
            'A `Tooltip.Warp` must be instantiated within a `Gateway`.');
    }

    /**
     * Hide the tooltip by removing its element from the gateway.
     */
    @bind
    hideTooltip() {
        this.getContext(null, contextKey).warpOut(this.props.gateName, this.state.element);

        this.setState({
            element: null,
            visible: false
        });
    }

    /**
     * Show the tooltip by adding its element to the gateway.
     *
     * We need to clone the provided tooltip element and pass along the
     * warp target to position relative to.
     */
    @bind
    showTooltip() {
        let tooltip = this.props.tooltip,
            element = null,
            targetElement = ReactDOM.findDOMNode(this);

        // Already an element
        if (React.isValidElement(tooltip)) {
            element = React.cloneElement(tooltip, { targetElement });

        // Create an element
        } else {
            element = (
                <Tooltip key={this.getUID()} targetElement={targetElement}>
                    {tooltip}
                </Tooltip>
            );
        }

        this.getContext(null, contextKey).warpIn(this.props.gateName, element);

        this.setState({
            element,
            visible: true
        });
    }

    /**
     * Toggles the display of the tooltip.
     */
    @bind
    toggleTooltip() {
        if (this.state.visible) {
            this.hideTooltip();
        } else {
            this.showTooltip();
        }
    }

    /**
     * Render the child and wrap event handlers.
     *
     * @returns {ReactElement}
     */
    render() {
        let { children, mode } = this.props,
            props = {
                className: this.state.visible ? 'is-active' : ''
            };

        if (mode === 'hover') {
            props.onMouseOver = this.showTooltip;
            props.onMouseOut = this.hideTooltip;
        } else {
            props.onClick = this.toggleTooltip;
        }

        return this.transferToChild(children, props);
    }
}
