/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../Component';
import bind from '../../decorators/bind';
import { showHidePropTypes } from '../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';
import 'core-js/modules/es7.array.includes';
import 'core-js/modules/es7.object.values';

export default class Menu extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        hideSelected: false
    };

    static propTypes = {
        ...showHidePropTypes,
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

        let newContext = this.getContext(context);

        this.state = {
            expanded: newContext.expanded,
            highlighted: '',
            index: -1,
            values: new Set(newContext.selectedValues)
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
        let newContext = this.getContext(nextContext);

        this.setState({
            expanded: newContext.expanded,
            values: new Set(newContext.selectedValues)
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
        let disabled = option.disabled,
            selected = this.state.values.has(option.value);

        return (
            <li key={option.value}>
                <a
                    role="option"
                    className={this.formatChildClass('option', {
                        'is-disabled': disabled,
                        'is-highlighted': (this.state.highlighted === option.value),
                        'is-selected': selected
                    })}
                    aria-disabled={disabled}
                    aria-selected={selected}
                    onClick={disabled ? null : this.selectValue.bind(this, option.value)}
                >
                    <span className={this.formatChildClass('option-label')}>
                        {option.label}
                    </span>

                    {option.description && (
                        <span className={this.formatChildClass('option-desc')}>
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
                    className={this.formatChildClass('group', {
                        'is-disabled': group.disabled
                    })}
                    aria-disabled={group.disabled}
                >
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
        let context = this.getContext(),
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

        let context = this.getContext(),
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
        let options = this.getContext().options,
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
            expanded = this.state.expanded,
            { multiple, inputID } = this.getContext();

        return (
            <div
                role="listbox"
                id={this.formatID('select-menu', inputID)}
                className={this.formatChildClass('menu', {
                    'hide-selected': (props.hideSelected && !multiple),
                    'is-expanded': expanded,
                    'is-multiple': multiple
                })}
                tabIndex="-1"
                aria-multiselectable={multiple}
                aria-hidden={!expanded}
                aria-expanded={expanded}
                {...this.inheritNativeProps(props)}
            >
                <ol>
                    {this.renderOptions()}
                </ol>
            </div>
        );
    }
}
