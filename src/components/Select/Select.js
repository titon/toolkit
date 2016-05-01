/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import { default as InputSelect } from '../Input/Select';
import Menu from './Menu';
import bind from '../../decorators/bind';
import children from '../../prop-types/children';
import formatInputName from '../../utility/formatInputName';
import invariant from '../../utility/invariant';
import isOutsideElement from '../../utility/isOutsideElement';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';
import { TOUCH } from '../../flags';

export default class Select extends InputSelect {
    static module = MODULE;

    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        ...InputSelect.defaultProps,
        arrow: <span className="caret-down" />,
        countMessage: '{count} of {total} selected',
        defaultLabel: 'Select an Option',
        listLimit: 3,
        multipleFormat: 'list',
        native: TOUCH
    };

    static propTypes = {
        ...InputSelect.propTypes,
        arrow: PropTypes.node,
        children: children(Menu),
        countMessage: PropTypes.string,
        defaultLabel: PropTypes.string,
        listLimit: PropTypes.number,
        multipleFormat: PropTypes.oneOf(['count', 'list']),
        native: PropTypes.bool
    };

    /**
     * Map options, values, and setup state.
     *
     * @param {Object} props
     */
    constructor(props) {
        super(props);

        if (props.multiple) {
            invariant(!props.native && !TOUCH,
              'Selects using `multiple` cannot use `native` controls on non-touch devices.');
        }

        this.state = {
            ...this.state,
            expanded: false,
            options: this.extractOptions(props.options),
            value: this.extractValues(props.defaultValue, props.multiple)
        };
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        let { name, options, multiple } = this.props,
            state = this.state;

        return {
            expanded: state.expanded,
            hideMenu: this.hideMenu,
            inputID: formatInputName(name),
            inputName: name,
            mappedOptions: state.options,
            multiple,
            options,
            selectValue: this.selectValue,
            selectedValues: this.extractValues(state.value, true),
            showMenu: this.showMenu,
            toggleMenu: this.toggleMenu,
            uid: this.getUID()
        };
    }

    /**
     * Bind handlers before mounting.
     */
    componentWillMount() {
        window.addEventListener('click', this.handleOnClickOut);
    }

    /**
     * Always return true as we need to update the dropdown menu.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return this.hasMenu() ? true : super.shouldComponentUpdate(nextProps, nextState);
    }

    /**
     * Only trigger `changing` events when appropriate.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     */
    componentWillUpdate(nextProps, nextState) {
        if (nextState.value !== this.state.value) {
            super.componentWillUpdate(nextProps, nextState);
        }
    }

    /**
     * Only trigger `changed` events when appropriate.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.value !== this.state.value) {
            super.componentDidUpdate(prevProps, prevState);
        }
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
     * @param {String|String[]} value
     * @param {Boolean} multiple
     * @returns {String|String[]}
     */
    extractValues(value, multiple) {
        let values = Array.isArray(value) ? value : [value];

        if (!multiple) {
            return values[0] || '';
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
        let { value, options } = this.state,
            props = this.props,
            label = [],
            count = 0,
            limit = props.listLimit,
            message = '';

        if (!value.length) {
            return props.defaultLabel;
        }

        if (!Array.isArray(value)) {
            value = [value];
        }

        value.forEach(val => {
            let option = options[val];

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

            default:
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
        return (Children.count(this.props.children) > 0);
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
     * @param {String|String[]} value
     */
    @bind
    selectValue(value) {
        this.setState({
            value: this.extractValues(value, this.props.multiple)
        });
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
     * Render the custom select.
     *
     * @returns {ReactElement}
     */
    render() {
        let { native, ...props } = this.props,
            { expanded } = this.state,
            inputProps = this.gatherProps(false),
            stateClasses = this.gatherStateClasses();

        // Add another state class
        stateClasses['is-native'] = native;

        return (
            <div
                ref="container"
                id={this.formatID('select', inputProps.id)}
                className={this.formatClass(stateClasses)}
                aria-disabled={props.disabled}
                {...this.inheritNativeProps(props)}
            >
                <select
                    {...inputProps}
                    onFocus={this.handleOnFocus}
                    onBlur={this.handleOnBlur}
                >
                    {this.renderOptions(props.options)}
                </select>

                <div
                    role="button"
                    className={this.formatChildClass('toggle', stateClasses)}
                    onClick={this.handleOnClickLabel}
                    aria-controls={native ? null : this.formatID('select-toggle', inputProps.id)}
                    aria-haspopup={native ? null : true}
                    aria-expanded={native ? null : expanded}
                >
                    <span className={this.formatChildClass('label')}>
                        {this.getSelectedLabel()}
                    </span>

                    <span className={this.formatChildClass('arrow')}>
                        {props.arrow}
                    </span>
                </div>

                {native ? null : props.children}
            </div>
        );
    }
}
