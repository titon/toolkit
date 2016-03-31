/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import invariant from '../../utility/invariant';
import CONTEXT_TYPES from './ContextTypes';

export default class Gate extends Component {
    static contextTypes = {
        registerGate: CONTEXT_TYPES.registerGate
    };

    static defaultProps = {
        elementClassName: 'gate'
    };

    static propTypes = {
        className: cssClass,
        contract: PropTypes.func.isRequired,
        elementClassName: cssClass.isRequired,
        gateClassName: cssClass.isRequired,
        name: PropTypes.string.isRequired
    };

    state = {
        children: []
    };

    /**
     * Register the gate on instantiation.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super();

        context.registerGate(props.name, this.handleOnWarpIn, this.handleOnWarpOut);
    }

    /**
     * Handles the adding of elements from the gateway.
     *
     * @param {ReactElement} element
     */
    @bind
    handleOnWarpIn(element) {
        if (this.isValidElement(element)) {
            this.setState({
                children: this.state.children.concat([element])
            });
        }
    }

    /**
     * Handles the removing of elements from the gateway.
     *
     * @param {ReactElement} element
     */
    @bind
    handleOnWarpOut(element) {
        if (this.isValidElement(element)) {
            this.setState({
                children: this.state.children.filter(el => el !== element)
            });
        }
    }

    /**
     * Validate that a value is in fact a React element and that it matches the contract.
     *
     * @param {ReactElement} element
     * @returns {Boolean}
     */
    isValidElement(element) {
        let { contract, name } = this.props;

        invariant(React.isValidElement(element) && element.type === contract,
            'Value passed to "%s" `Gate` must be an instance of the `%s` component.',
            name, contract.name);

        return true;
    }

    /**
     * Method for rendering the children within the gate.
     * This allows for sub-classes to implement custom functionality.
     *
     * @param {ReactElement[]} children
     * @returns {ReactElement[]}
     */
    renderChildren(children) {
        return children;
    }

    /**
     * Render the gateway and its children.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                className={this.formatClass(
                    props.elementClassName,
                    props.className,
                    props.gateClassName
                )}
                {...this.inheritNativeProps(props)}>

                {this.renderChildren(this.state.children)}
            </div>
        );
    }
}
