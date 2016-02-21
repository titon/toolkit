/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import SelectPropTypes from './PropTypes';
import bind from '../../decorators/bind';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import { TOUCH } from '../../flags';

export default class Select extends Component {
    static defaultProps = {
        elementClassName: 'select',
        toggleClassName: ['select', 'toggle'],
        labelClassName: ['select', 'label'],
        arrowClassName: ['select', 'arrow'],
        native: TOUCH,
        disabled: false,
        required: false,
        arrow: <span className="caret-down" />,
        defaultLabel: 'Select An Option'
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        toggleClassName: cssClass.isRequired,
        labelClassName: cssClass.isRequired,
        arrowClassName: cssClass.isRequired,
        name: PropTypes.string.isRequired,
        options: SelectPropTypes.optionList.isRequired,
        native: PropTypes.bool,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        arrow: PropTypes.node,
        defaultLabel: PropTypes.string,
        defaultValue: collection.string
    };

    /**
     * Map options, values, and setup state.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        this.state = {
            values: this.extractValues(props.defaultValue),
            options: this.extractOptions(props.options),
            label: props.defaultLabel
        };
    }

    /**
     * Extract the list of options (and nested optgroups) and map them to a key and label.
     *
     * @param {Object[]} options
     * @returns {Object}
     */
    extractOptions(options) {
        let map = {};

        options.forEach(option => {
            // Optgroup
            if (option.options) {
                option.options.forEach(child => {
                    map[child.value] = child;
                });

            // Option
            } else {
                map[option.value] = option;
            }
        });

        return map;
    }

    /**
     * Extract a value, or list of values, and return the default set.
     *
     * @param {*|*[]} defaultValue
     * @returns {Set}
     */
    extractValues(defaultValue) {
        let value = [];

        if (Array.isArray(defaultValue)) {
            value = defaultValue;

        } else if (defaultValue) {
            value.push(defaultValue);
        }

        return new Set(value);
    }

    /**
     * Handler that selects a new value.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnChange(e) {
        let value = e.target.value,
            option = this.state.options[value] || {};

        this.setState({
            values: new Set([value]),
            label: option.label || option.title || this.props.defaultLabel
        });
    }

    /**
     * Render the list of options as `<option>` and `<optgroup>` elements.
     *
     * @param {Object} options
     * @returns {ReactElement[]}
     */
    renderOptions(options) {
        let elements = [];

        options.forEach(option => {
            // Optgroup
            if (option.options) {
                elements.push(
                    <optgroup
                        key={option.title}
                        label={option.title}
                        disabled={option.disabled}>

                        {this.renderOptions(option.options)}
                    </optgroup>
                );

            // Option
            } else {
                elements.push(
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}>

                        {option.title}
                    </option>
                );
            }
        });

        return elements;
    }

    /**
     * Render the custom select with option dropdown menu.
     *
     * @returns {ReactElement}
     */
    render() {
        let { name, native, ...props } = this.props,
            state = this.state,
            selected = Array.from(state.values),
            id = name;

        return (
            <span
                id={this.formatID('select', id)}
                className={this.formatClass(props.elementClassName, props.className, {
                    'is-native': native
                })}
                aria-disabled={props.disabled}
                {...this.inheritNativeProps(props)}>

                <select
                    id={id}
                    name={name}
                    defaultValue={selected[0]}
                    disabled={props.disabled}
                    required={props.required}
                    onChange={this.handleOnChange}>

                    {this.renderOptions(props.options)}
                </select>

                <label
                    htmlFor={id}
                    className={this.formatClass(props.toggleClassName)}>

                    <span className={this.formatClass(props.labelClassName)}>
                        {state.label}
                    </span>

                    <span className={this.formatClass(props.arrowClassName)}>
                        {props.arrow}
                    </span>
                </label>
            </span>
        );
    }
}
