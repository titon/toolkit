/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';

export default class Switch extends Component {
    static defaultProps = {
        barClassName: ['switch', 'bar'],
        defaultChecked: false,
        disabled: false,
        elementClassName: 'switch',
        required: false,
        stacked: false,
        toggleClassName: ['switch', 'toggle']
    };

    static propTypes = {
        barClassName: cssClass.isRequired,
        className: cssClass,
        defaultChecked: PropTypes.bool,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        disabled: PropTypes.bool,
        elementClassName: cssClass.isRequired,
        labelOff: PropTypes.string,
        labelOn: PropTypes.string,
        name: PropTypes.string.isRequired,
        required: PropTypes.bool,
        stacked: PropTypes.bool,
        toggleClassName: cssClass.isRequired
    };

    /**
     * Validate props.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        this.state = {
            checked: props.defaultChecked,
            value: props.defaultValue || 1
        };
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
     * Render the custom switch using a checkbox.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            state = this.state,
            name = props.name;

        return (
            <span
                id={this.formatID('switch', name)}
                className={this.formatClass(props.elementClassName, props.className, {
                    '@stacked': props.stacked,
                    'is-checked': state.checked,
                    'is-disabled': props.disabled,
                    'is-required': props.required
                })}
                aria-checked={state.checked}
                aria-disabled={props.disabled}
                {...this.inheritNativeProps(props)}>

                <input
                    id={name}
                    name={name}
                    type="checkbox"
                    value={state.value}
                    checked={state.checked}
                    disabled={props.disabled}
                    required={props.required}
                    onChange={this.handleOnChange} />

                <label
                    htmlFor={name}
                    className={this.formatClass(props.barClassName)}
                    data-switch-on={props.labelOn}
                    data-switch-off={props.labelOff}>

                    <span className={this.formatClass(props.toggleClassName)} />
                </label>
            </span>
        );
    }
}
