/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from '../../Component';
import SelectPropTypes from './PropTypes';
import bind from '../../decorators/bind';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import formatInputName from '../../utility/formatInputName';
import invariant from '../../utility/invariant';
import isOutsideElement from '../../utility/isOutsideElement';
import CONTEXT_TYPES from './ContextTypes';
import { TOUCH } from '../../flags';

export default class Select extends Component {
    static childContextTypes = CONTEXT_TYPES;

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
        defaultLabel: 'Select An Option',
        defaultValue: []
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
        defaultValue: collection.string,
        onChanging: collection.func,
        onChanged: collection.func
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
            options: this.extractOptions(props.options),
            expanded: false
        };

        this.generateUID();
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        let { name, options, multiple } = this.props;

        return {
            uid: this.uid,
            multiple,
            expanded: this.state.expanded,
            inputID: formatInputName(name),
            inputName: name,
            options,
            selectedValues: this.state.values,
            selectValue: this.selectValue,
            hideMenu: this.hideMenu,
            showMenu: this.showMenu,
            toggleMenu: this.toggleMenu
        };
    }

    /**
     * Bind handlers before mounting.
     */
    componentWillMount() {
        window.addEventListener('click', this.handleOnClickOut);
    }

    /**
     * Unbind handlers when unmounting.
     */
    componentWillUnmount() {
        window.removeEventListener('click', this.handleOnClickOut);
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
            label = [],
            count = 0;

        if (!values.length) {
            return props.defaultLabel;
        }

        values.forEach(value => {
            let option = options[value];

            if (typeof option !== 'undefined') {
                label.push(option.selectedLabel || option.label);
                count++;
            }
        });

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
     * Returns true if a custom drop down menu is being used.
     *
     * @returns {Boolean}
     */
    hasMenu() {
        let { native, children } = this.props;

        return (!native && Children.count(children));
    }

    /**
     * Hide the menu by setting the state to closed.
     */
    @bind
    hideMenu() {
        this.setState({
            expanded: false
        });
    }

    /**
     * Select a value or list of values.
     *
     * @param {String|String[]} values
     */
    @bind
    selectValue(values) {
        let oldValues = this.state.values,
            newValues = Array.isArray(values) ? values : [values];

        this.emitEvent('changing', [newValues, oldValues]);

        this.setState({
            values: newValues
        });

        this.emitEvent('changed', [newValues, oldValues]);
    }

    /**
     * Show the menu by setting the state to opened.
     */
    @bind
    showMenu() {
        this.setState({
            expanded: true
        });
    }

    /**
     * Toggle the open state of the menu.
     */
    @bind
    toggleMenu() {
        if (this.props.disabled || !this.hasMenu()) {
            return;
        }

        if (this.state.expanded) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }

    /**
     * Handler that closes the menu when focus is lost.
     */
    @bind
    handleOnBlur() {
        if (!this.props.disabled && this.state.expanded && this.hasMenu()) {
            this.hideMenu();
        }
    }

    /**
     * Handler that selects a new value.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnChange(e) {
        if (this.props.disabled) {
            return;
        }

        let values = [];

        Array.from(e.target.selectedOptions)
            .forEach(option => values.push(option.value));

        this.selectValue(values);
    }

    /**
     * Handler that toggles the display of the menu.
     */
    @bind
    handleOnClickLabel() {
        this.toggleMenu();
    }

    /**
     * Handler that hides the menu if clicked outside the menu element.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClickOut(e) {
        /* eslint operator-linebreak: 0 */

        if (
            !this.props.disabled && this.state.expanded &&
            this.hasMenu() && isOutsideElement(this.refs.container, e.target)
        ) {
            this.hideMenu();
        }
    }

    /**
     * Handler that shows the menu when the select is focused.
     */
    @bind
    handleOnFocus() {
        if (!this.props.disabled && !this.state.expanded && this.hasMenu()) {
            this.showMenu();
        }
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
                        key={option.label}
                        label={option.label}
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

                        {option.label}
                    </option>
                );
            }
        });

        return elements;
    }

    /**
     * Render the custom select.
     *
     * @returns {ReactElement}
     */
    render() {
        let { name, native, multiple, disabled, required, ...props } = this.props,
            { values, expanded } = this.state,
            id = formatInputName(name),
            classProps = {
                'is-native': native,
                'is-disabled': disabled,
                'is-required': required,
                'is-active': expanded
            };

        return (
            <div
                ref="container"
                id={this.formatID('select', id)}
                className={this.formatClass(props.elementClassName, props.className, classProps, {
                    '@multiple': multiple
                })}
                aria-disabled={disabled}
                {...this.inheritNativeProps(props)}>

                <select
                    id={id}
                    name={name}
                    value={multiple ? values : values[0]}
                    disabled={disabled}
                    required={required}
                    multiple={multiple}
                    onChange={this.handleOnChange}
                    onFocus={this.handleOnFocus}
                    onBlur={this.handleOnBlur}>

                    {this.renderOptions(props.options)}
                </select>

                <div
                    className={this.formatClass(props.toggleClassName, classProps)}
                    onClick={this.handleOnClickLabel}
                    aria-controls={native ? null : this.formatID('select', id, 'menu')}
                    aria-haspopup={native ? null : true}
                    aria-expanded={native ? null : expanded}>

                    <span className={this.formatClass(props.labelClassName)}>
                        {this.getSelectedLabel()}
                    </span>

                    <span className={this.formatClass(props.arrowClassName)}>
                        {props.arrow}
                    </span>
                </div>

                {native ? null : props.children}
            </div>
        );
    }
}
