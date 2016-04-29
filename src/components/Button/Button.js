/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import { states } from '../PropTypes';
import MODULE from './module';

export default class Button extends Component {
    static module = MODULE;

    static defaultProps = {
        disabled: false,
        large: false,
        primary: false,
        secondary: false,
        small: false,
        type: 'button'
    };

    static propTypes = {
        children: PropTypes.node,
        disabled: PropTypes.bool,
        href: PropTypes.string,
        large: PropTypes.bool,
        primary: PropTypes.bool,
        secondary: PropTypes.bool,
        small: PropTypes.bool,
        state: states,
        type: PropTypes.oneOf(['button', 'submit'])
    };

    state = {
        pressed: false
    };

    /**
     * Handler for setting `pressed` to true when the mouse clicks the button.
     * Exists for proper ARIA support.
     */
    @bind
    handleOnMouseDown() {
        this.setState({
            pressed: true
        });
    }

    /**
     * Handler for setting `pressed` to false when the mouse releases the button.
     * Exists for proper ARIA support.
     */
    @bind
    handleOnMouseUp() {
        this.setState({
            pressed: false
        });
    }

    /**
     * Render the button as either an anchor link or button.
     *
     * @returns {ReactElement}
     */
    render() {
        let { pressed } = this.state,
            props = this.props,
            buttonProps = {
                className: this.formatClass({
                    ['@large']: props.large,
                    ['@primary']: props.primary,
                    ['@secondary']: props.secondary,
                    ['@small']: props.small,
                    ['@' + props.state]: props.state,
                    'is-disabled': props.disabled,
                    'is-pressed': pressed
                }),
                role: 'button'
            },
            nativeProps = this.inheritNativeProps(props);

        // If an anchor link
        if (props.href) {
            buttonProps.href = props.href;

            return (
                <a {...buttonProps} {...nativeProps}>
                    {props.children}
                </a>
            );
        }

        // If a button
        buttonProps = {
            ...buttonProps,
            'aria-pressed': pressed,
            disabled: props.disabled,
            onMouseDown: this.handleOnMouseDown,
            onMouseUp: this.handleOnMouseUp,
            type: props.type
        };

        return (
            <button {...buttonProps} {...nativeProps}>
                {props.children}
            </button>
        );
    }
}
