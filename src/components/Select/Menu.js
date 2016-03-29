/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';
import '../../polyfills/Array.includes';
import '../../polyfills/Object.values';

export default class Menu extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        descClassName: ['select', 'option-desc'],
        elementClassName: ['select', 'menu'],
        groupClassName: ['select', 'group'],
        hideSelected: false,
        labelClassName: ['select', 'option-label'],
        optionClassName: ['select', 'option']
    };

    static propTypes = {
        className: cssClass,
        descClassName: cssClass.isRequired,
        elementClassName: cssClass.isRequired,
        groupClassName: cssClass.isRequired,
        hideSelected: PropTypes.bool,
        labelClassName: cssClass.isRequired,
        onHidden: collection.func,
        onHiding: collection.func,
        onShowing: collection.func,
        onShown: collection.func,
        optionClassName: cssClass.isRequired
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
            highlighted: '',
            index: -1,
            values: new Set(context.selectedValues)
        };
    }

    /**
     * Bind events before mounting.
     */
    componentWillMount() {
        window.addEventListener('keydown', this.handleOnKeyDown);
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
     * Remove events when unmounting.
     */
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleOnKeyDown);
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
                <a
                    role="option"
                    className={this.formatClass(props.optionClassName, {
                        'is-disabled': disabled,
                        'is-highlighted': (this.state.highlighted === option.value),
                        'is-selected': selected
                    })}
                    aria-disabled={disabled}
                    aria-selected={selected}
                    onClick={disabled ? null : this.selectValue.bind(this, option.value)}>

                    <span className={this.formatClass(props.labelClassName)}>
                        {option.label}
                    </span>

                    {option.description && (
                        <span className={this.formatClass(props.descClassName)}>
                            {option.description}
                        </span>
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
     * Handler that cycles through the menu options when a specific key is pressed.
     * If `ArrowUp` or `ArrowDown` is pressed, it will highlight the next or previous option.
     * If `Enter` is pressed, the value will be selected, else if `Escape` is pressed,
     * the menu and state will be closed.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnKeyDown(e) {
        if (!this.state.expanded || !['ArrowUp', 'ArrowDown', 'Escape', 'Enter'].includes(e.key)) {
            return;
        }

        e.preventDefault();

        let context = this.context,
            options = Object.values(context.mappedOptions),
            index = this.state.index,
            step = 0;

        switch (e.key) {
            case 'Escape':
                this.setState({
                    highlighted: '',
                    index: -1
                });

                context.hideMenu();
                break;

            case 'Enter':
                if (index >= 0) {
                    this.selectValue(options[index].value);
                }
                break;

            case 'ArrowUp':
            case 'ArrowDown':
            default:
                step = (e.key === 'ArrowUp') ? -1 : 1;
                index += step;

                while ((typeof options[index] === 'undefined') || options[index].disabled) {
                    index += step;

                    if (index >= options.length) {
                        index = 0;
                    } else if (index < 0) {
                        index = options.length - 1;
                    }
                }

                this.setState({
                    highlighted: options[index].value,
                    index
                });
                break;
        }
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
                id={this.formatID('select-menu', context.inputID)}
                className={this.formatClass(props.elementClassName, props.className, {
                    'hide-selected': (props.hideSelected && !context.multiple),
                    'is-expanded': expanded,
                    'is-multiple': context.multiple
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
