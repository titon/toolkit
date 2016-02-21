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
import invariant from '../../utility/invariant';
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
        multiple: false,
        multipleFormat: 'list',
        countMessage: '{count} of {total} selected',
        listLimit: 3,
        arrow: <span className="caret-down" />,
        defaultLabel: 'Select An Option'
    };

    static propTypes = {
        children: PropTypes.node,
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
        multiple: PropTypes.bool,
        multipleFormat: PropTypes.oneOf(['count', 'list']),
        countMessage: PropTypes.string,
        listLimit: PropTypes.number,
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

        if (props.multiple) {
            invariant(!props.native && !TOUCH, 'Selects using `multiple` cannot use `native` controls on non-touch devices.');
        }

        this.state = {
            values: this.extractValues(props.defaultValue, props.multiple),
            options: this.extractOptions(props.options)
        };

        this.generateUID();
    }

    /**
     * Emit `changing` events before rendering.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     */
    componentWillUpdate(nextProps, nextState) {
        this.emitEvent('changing', [nextState.values, this.state.values]);
    }

    /**
     * Emit `changed` events before rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        this.emitEvent('changed', [this.state.values, prevState.values]);
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
     * @param {String|String[]} defaultValue
     * @param {Boolean} multiple
     * @returns {String[]}
     */
    extractValues(defaultValue, multiple) {
        let values = Array.isArray(defaultValue) ? defaultValue : [defaultValue];

        if (!multiple) {
            values = values.slice(0, 1);
        }

        return values;
    }

    /**
     * Return a label for the currently selected option(s).
     * If `multiple` options are selected, attempt to format them based
     * on the `multipleFormat` prop.
     *
     * @returns {String}
     */
    getSelectedLabel() {
        let { values, options } = this.state,
            props = this.props,
            label = [];

        if (!values.length) {
            return props.defaultLabel;
        }

        values.forEach(value => {
            let option = options[value];

            if (typeof option !== 'undefined') {
                label.push(option.label || option.title);
            }
        });

        let count = label.length;

        switch (props.multipleFormat) {
            case 'count':
                return props.countMessage
                    .replace('{count}', count)
                    .replace('{total}', Object.keys(options).length);

            case 'list':
            default:
                let limit = props.listLimit,
                    message = label.slice(0, limit).join(', ');

                if (limit < count) {
                    message += ' ...';
                }

                return message;
        }
    }

    /**
     * Handler that selects a new value.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnChange(e) {
        let values = [];

        Array.from(e.target.selectedOptions).forEach(option => {
            values.push(option.value);
        });

        this.setState({
            values
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
        let { name, native, multiple, ...props } = this.props,
            state = this.state,
            selected = state.values,
            id = name;

        return (
            <span
                id={this.formatID('select', id)}
                className={this.formatClass(props.elementClassName, props.className, {
                    'is-native': native,
                    'is-multiple': multiple
                })}
                aria-disabled={props.disabled}
                {...this.inheritNativeProps(props)}>

                <select
                    id={id}
                    name={name}
                    value={multiple ? selected : selected[0]}
                    disabled={props.disabled}
                    required={props.required}
                    multiple={multiple}
                    onChange={this.handleOnChange}>

                    {this.renderOptions(props.options)}
                </select>

                <label
                    htmlFor={id}
                    className={this.formatClass(props.toggleClassName)}>

                    <span className={this.formatClass(props.labelClassName)}>
                        {this.getSelectedLabel()}
                    </span>

                    <span className={this.formatClass(props.arrowClassName)}>
                        {props.arrow}
                    </span>
                </label>

                {props.children}
            </span>
        );
    }
}
