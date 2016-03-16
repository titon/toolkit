/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Radio extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        disabled: false,
        elementClassName: 'radio',
        required: false,
        toggleClassName: ['radio', 'toggle']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        disabled: PropTypes.bool,
        elementClassName: cssClass.isRequired,
        required: PropTypes.bool,
        toggleClassName: cssClass.isRequired,
        value: PropTypes.string.isRequired
    };

    /**
     * Setup state.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super();

        this.state = {
            value: props.value,
            checked: (context.checkedValue === props.value)
        };
    }

    /**
     * Update the state based on the context of when a radio is changed.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            value: nextProps.value,
            checked: (nextContext.checkedValue === nextProps.value)
        });
    }

    /**
     * Handler that toggles the checked state when the toggle is clicked.
     */
    @bind
    handleOnChange() {
        this.context.selectValue(this.state.value);
    }

    /**
     * Render the custom radio.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            state = this.state,
            value = state.value,
            name = this.context.inputName,
            id = this.context.inputID + '-' + value,
            classProps = {
                'is-checked': state.checked,
                'is-disabled': props.disabled,
                'is-required': props.required
            };

        return (
            <div
                id={this.formatID('radio', id)}
                className={this.formatClass(props.elementClassName, props.className, classProps)}
                aria-checked={state.checked}
                aria-disabled={props.disabled}
                {...this.inheritNativeProps(props)}>

                <input
                    id={id}
                    name={name}
                    type="radio"
                    value={value}
                    checked={state.checked}
                    disabled={props.disabled}
                    required={props.required}
                    onChange={this.handleOnChange} />

                <label
                    htmlFor={id}
                    className={this.formatClass(props.toggleClassName, classProps)} />

                {props.children}
            </div>
        );
    }
}
