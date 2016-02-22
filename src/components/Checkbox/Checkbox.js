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

export default class Checkbox extends Component {
    static defaultProps = {
        elementClassName: 'checkbox',
        toggleClassName: ['checkbox', 'toggle'],
        disabled: false,
        required: false,
        multiple: false,
        defaultChecked: false
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        toggleClassName: cssClass.isRequired,
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        multiple: PropTypes.bool,
        defaultValue: PropTypes.string,
        defaultChecked: PropTypes.bool
    };

    /**
     * Validate props and setup state.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        if (props.multiple) {
            invariant(Boolean(props.defaultValue), 'A value is required when using `multiple` checkboxes.');
        }

        this.state = {
            value: props.defaultValue || '1',
            checked: props.defaultChecked
        };

        this.generateUID();
    }

    /**
     * Handler that toggles the checked state when the toggle is clicked.
     */
    @bind
    handleOnChange() {
        this.setState({
            checked: !this.state.checked
        });
    }

    /**
     * Render the custom checkbox.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            state = this.state,
            name = props.name,
            id = name,
            classProps = {
                'is-checked': state.checked,
                'is-disabled': props.disabled,
                'is-required': props.required
            };

        if (props.multiple) {
            name += '[]';
            id += '-' + state.value;
        }

        return (
            <div
                id={this.formatID('checkbox', id)}
                className={this.formatClass(props.elementClassName, props.className, classProps)}
                aria-checked={state.checked}
                aria-disabled={props.disabled}
                {...this.inheritNativeProps(props)}>

                <input
                    id={id}
                    name={name}
                    type="checkbox"
                    value={state.value}
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
