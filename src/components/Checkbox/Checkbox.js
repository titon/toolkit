/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClassName from '../../prop-types/cssClassName';
import invariant from '../../utility/invariant';

export default class Checkbox extends Component {
    static defaultProps = {
        className: 'checkbox',
        toggleClassName: ['checkbox', 'toggle'],
        disabled: false,
        multiple: false,
        defaultValue: '',
        defaultChecked: false
    };

    static propTypes = {
        className: cssClassName.isRequired,
        toggleClassName: cssClassName.isRequired,
        uniqueClassName: cssClassName,
        name: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        multiple: PropTypes.bool,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        defaultChecked: PropTypes.bool
    };

    /**
     * Validate props.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        if (props.multiple) {
            invariant(!!props.defaultValue, 'A value is required when using `multiple` checkboxes.');
        }

        // Build the state here instead of using ES7 properties
        this.state = {
            value: props.defaultValue || 1,
            checked: props.defaultChecked,
            disabled: props.disabled
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
     * Render the custom checkbox.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            state = this.state,
            name = props.name,
            id = name;

        if (props.multiple) {
            name += '[]';
            id += '-' + props.defaultValue;
        }

        return (
            <span
                id={this.formatID('checkbox', id)}
                className={this.formatClass(props.className, {
                    'is-checked': state.checked
                })}
                aria-checked={state.checked}
                aria-disabled={state.disabled}
                {...this.inheritNativeProps(props)}>

                <input
                    id={id}
                    name={name}
                    type="checkbox"
                    value={state.value}
                    checked={state.checked}
                    disabled={state.disabled}
                    onChange={this.handleOnChange} />

                <label
                    htmlFor={id}
                    className={this.formatClass(props.toggleClassName)} />
            </span>
        );
    }
}
