/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Menu extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['select', 'menu'],
        optionClassName: ['select', 'menu-option'],
        groupClassName: ['select', 'menu-group'],
        titleClassName: ['select', 'menu-title'],
        descClassName: ['select', 'menu-desc'],
        hideFirst: false,
        hideSelected: false
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        optionClassName: cssClass.isRequired,
        groupClassName: cssClass.isRequired,
        titleClassName: cssClass.isRequired,
        descClassName: cssClass.isRequired,
        hideFirst: PropTypes.bool,
        hideSelected: PropTypes.bool
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
            expanded: false,
            values: new Set(context.selectedValues)
        };
    }

    /**
     * Update the list of selected values.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            values: new Set(nextContext.selectedValues)
        });
    }

    /**
     * Only update if the selected values change.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.values !== this.state.values);
    }

    /**
     * Create an option element with the defined settings.
     *
     * @param {Object} option
     * @returns {ReactElement}
     */
    createOption(option) {
        let props = this.props,
            disabled = option.disabled,
            selected = this.state.values.has(option.value);

        return (
            <li key={option.value}
                role="option"
                className={this.formatClass(props.optionClassName, {
                    'is-disabled': disabled,
                    'is-selected': selected
                })}
                aria-disabled={disabled}
                aria-selected={selected}
                onClick={disabled ? null : this.selectValue.bind(this, option.value)}>

                <span className={this.formatClass(props.titleClassName)}>{option.title}</span>

                {option.description && (
                    <span className={this.formatClass(props.descClassName)}>{option.description}</span>
                )}
            </li>
        );
    }

    /**
     * Create an option group element with the defined settings.
     *
     * @param {Object} group
     * @returns {ReactElement}
     */
    createOptGroup(group) {
        return (
            <li key={group.title}
                className={this.formatClass(this.props.groupClassName, {
                    'is-disabled': group.disabled
                })}
                aria-disabled={group.disabled}>

                {group.title}
            </li>
        );
    }

    /**
     * When a list item is clicked, update the list of selected options.
     * If `multiple` is enabled, toggle the value, else clear all previous values.
     *
     * @param {String} value
     */
    selectValue(value) {
        let context = this.context,
            values = new Set(this.state.values);

        // Toggle the value
        if (context.multiple) {
            if (values.has(value)) {
                values.delete(value);
            } else {
                values.add(value);
            }

        // Clear previous values
        } else {
            values.clear();
            values.add(value);
        }

        context.selectValue(Array.from(values));
    }

    /**
     * Render the list of options as `<li>` elements.
     *
     * @returns {ReactElement[]}
     */
    renderOptions() {
        let options = this.context.options,
            elements = [];

        options.forEach(option => {
            // Optgroup
            if (option.options) {
                elements.push(this.createOptGroup(option));

                option.options.forEach(child => {
                    elements.push(this.createOption(child));
                });

            // Option
            } else {
                elements.push(this.createOption(option));
            }
        });

        return elements;
    }

    /**
     * Render the custom select dropdown menu.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            context = this.context,
            expanded = false;

        return (
            <div
                role="listbox"
                id={this.formatID('select-menu')}
                className={this.formatClass(props.elementClassName, props.className, {
                    '@multiple': context.multiple,
                    'hide-first': props.hideFirst,
                    'hide-selected': (props.hideSelected && !context.multiple),
                    'is-expanded': expanded
                })}
                aria-multiselectable={context.multiple}
                aria-hidden={!expanded}
                aria-expanded={expanded}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {this.renderOptions()}
                </ol>
            </div>
        );
    }
}
