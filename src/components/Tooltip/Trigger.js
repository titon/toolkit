/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../Component';
import bind from '../../decorators/bind';

export default class Trigger extends Component {
    static contextTypes = {
        warpIn: PropTypes.func.isRequired,
        warpOut: PropTypes.func.isRequired
    };

    static defaultProps = {
        mode: 'hover'
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        gateName: PropTypes.string.isRequired,
        mode: PropTypes.oneOf(['click', 'hover']),
        tooltip: PropTypes.element.isRequired
    };

    state = {
        element: null,
        visible: false
    };

    /**
     * Handler that toggles the display of the tooltip using click events.
     */
    @bind
    handleOnClick() {
        if (this.state.visible) {
            this.hideTooltip();
        } else {
            this.showTooltip();
        }
    }

    /**
     * Hide the tooltip by removing its element from the gateway.
     */
    @bind
    hideTooltip() {
        this.context.warpOut(this.props.gateName, this.state.element);

        this.setState({
            element: null,
            visible: false
        });
    }

    /**
     * Show the tooltip by adding its element to the gateway.
     *
     * We need to clone the provided tooltip element and pass along the
     * trigger target to position relative to.
     */
    @bind
    showTooltip() {
        let element = React.cloneElement(this.props.tooltip, {
            targetElement: ReactDOM.findDOMNode(this)
        });

        this.context.warpIn(this.props.gateName, element);

        this.setState({
            element,
            visible: true
        });
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
            props.onMouseEnter = this.showTooltip;
            props.onMouseLeave = this.hideTooltip;
        } else {
            props.onClick = this.handleOnClick;
        }

        return this.transferToChild(children, props);
    }
}
