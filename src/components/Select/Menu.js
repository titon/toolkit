/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Menu extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['select', 'menu'],
        groupClassName: ['select', 'group'],
        optionClassName: ['select', 'option'],
        labelClassName: ['select', 'option-label'],
        descClassName: ['select', 'option-desc'],
        hideSelected: false
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        groupClassName: cssClass.isRequired,
        optionClassName: cssClass.isRequired,
        labelClassName: cssClass.isRequired,
        descClassName: cssClass.isRequired,
        hideSelected: PropTypes.bool,
        onHiding: collection.func,
        onHidden: collection.func,
        onShowing: collection.func,
        onShown: collection.func
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
            expanded: context.expanded,
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
            expanded: nextContext.expanded,
            values: new Set(nextContext.selectedValues)
        });
    }

    /**
     * Only update if the selected values or expanded state change.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.values !== this.state.values || nextState.expanded !== this.state.expanded);
    }

    /**
     * Emit `showing` or `hiding` events before rendering.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     */
    componentWillUpdate(nextProps, nextState) {
        if (nextState.expanded !== this.state.expanded) {
            this.emitEvent(this.state.expanded ? 'hiding' : 'showing');
        }
    }

    /**
     * Emit `shown` or `hidden` events after rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.expanded !== this.state.expanded) {
            this.emitEvent(this.state.expanded ? 'shown' : 'hidden');
        }
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
            <li key={option.value}>
                <a role="option"
                    className={this.formatClass(props.optionClassName, {
                        'is-disabled': disabled,
                        'is-selected': selected
                    })}
                    aria-disabled={disabled}
                    aria-selected={selected}
                    onClick={disabled ? null : this.selectValue.bind(this, option.value)}>

                    <span className={this.formatClass(props.labelClassName)}>{option.label}</span>

                    {option.description && (
                        <span className={this.formatClass(props.descClassName)}>{option.description}</span>
                    )}
                </a>
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
            <li key={group.label}>
                <span
                    className={this.formatClass(this.props.groupClassName, {
                        'is-disabled': group.disabled
                    })}
                    aria-disabled={group.disabled}>

                    {group.label}
                </span>
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

            context.hideMenu();
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
            expanded = this.state.expanded;

        return (
            <div
                role="listbox"
                id={this.formatID('select', context.inputID, 'menu')}
                className={this.formatClass(props.elementClassName, props.className, {
                    '@multiple': context.multiple,
                    'hide-selected': (props.hideSelected && !context.multiple),
                    'is-expanded': expanded
                })}
                tabIndex="-1"
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
