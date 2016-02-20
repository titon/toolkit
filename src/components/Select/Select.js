/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
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
        arrow: <span className="caret-down" />
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        toggleClassName: cssClass.isRequired,
        labelClassName: cssClass.isRequired,
        arrowClassName: cssClass.isRequired,
        name: PropTypes.string.isRequired,
        options: PropTypes.object.isRequired,
        native: PropTypes.bool,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        arrow: PropTypes.node,
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };

    /* eslint react/sort-comp: 0 */
    options = {};

    /**
     * Map options and setup state.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        this.extractOptions(props.options);

        this.state = {
            value: props.defaultValue || null,
            label: this.options[props.defaultValue] || ''
        };

        this.generateUID();
    }

    /**
     * Extract the list of options (and nested optgroups) and map them to a key and label.
     *
     * @param {Object} options
     */
    extractOptions(options) {
        Object.keys(options).forEach(value => {
            let label = options[value];

            // Optgroup
            if (typeof label === 'object') {
                this.extractOptions(label);

            // Option
            } else {
                this.options[value] = label;
            }
        });
    }

    /**
     * Handler that selects a new value.
     */
    @bind
    handleOnChange(e) {
    }

    /**
     * Render the list of options as `<option>` and `<optgroup>` elements.
     *
     * @param {Object} options
     * @returns {ReactElement[]}
     */
    renderOptions(options) {
        let elements = [];

        Object.keys(options).forEach(value => {
            let label = options[value];

            // Optgroup
            if (typeof label === 'object') {
                elements.push(
                    <optgroup key={value} label={value}>
                        {this.renderOptions(label)}
                    </optgroup>
                );

            // Option
            } else {
                elements.push(
                    <option key={value} value={value}>{label}</option>
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
                    disabled={props.disabled}
                    required={props.required}
                    onChange={this.handleOnChange}>

                    {this.renderOptions(props.options)}
                </select>

                <label
                    htmlFor={id}
                    className={this.formatClass(props.toggleClassName)}>

                    <span className={this.formatClass(props.labelClassName)}>
                        TODO
                    </span>

                    <span className={this.formatClass(props.arrowClassName)}>
                        {props.arrow}
                    </span>
                </label>
            </span>
        );
    }
}
