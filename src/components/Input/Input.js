/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import formatInputName from '../../utility/formatInputName';
import invariant from '../../utility/invariant';
import { defaultProps, propTypes } from './PropTypes';
import '../../polyfills/Array.includes';

export default class Input extends Component {
    static defaultProps = {
        ...defaultProps,
        elementClassName: 'input',
        type: 'text'
    };

    static propTypes = {
        ...propTypes,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        large: PropTypes.bool,
        small: PropTypes.bool,
        type: PropTypes.string
    };

    /**
     * Setup state.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        let defaultValue = props.defaultValue,
            defaultChecked = props.defaultChecked,
            compName = this.constructor.name.toLowerCase();

        // Select
        if (compName === 'select') {
            if (props.multiple) {
                defaultValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
            } else {
                defaultValue = String(defaultValue);
            }

        // Checkbox, Switch
        } else if (compName === 'switch' || compName === 'checkbox' || props.type === 'checkbox') {
            if (props.multiple) {
                invariant(defaultValue,
                    'A default value is required when using `multiple` checkboxes.');
            } else {
                defaultValue = defaultValue || '1';
            }

        // Radio
        } else if (compName === 'radio' || props.type === 'radio') {
            invariant(defaultValue, 'A default value is required when using radios.');

            if (typeof defaultChecked === 'string') {
                defaultChecked = (defaultValue === defaultChecked);
            }
        }

        this.state = {
            checked: Boolean(defaultChecked),
            type: (compName === 'input') ? props.type : compName,
            value: defaultValue
        };
    }

    /**
     * Only update if the value of the state changes.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.value !== this.state.value || nextState.checked !== this.state.checked);
    }

    /**
     * Emit `changing` events before rendering.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     */
    componentWillUpdate(nextProps, nextState) {
        let args = this.isChoiceType()
            ? [nextState.checked, nextState.value]
            : [nextState.value, this.state.value];

        this.emitEvent('changing', ...args);
    }

    /**
     * Emit `changed` events after rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        let state = this.state,
            args = this.isChoiceType()
                ? [state.checked, state.value]
                : [state.value, prevState.value];

        this.emitEvent('changed', ...args);
    }

    /**
     * Gather all the props that will be passed to the input element.
     * We only need to define a few hard requirements for props,
     * as all other props can be passed through natively.
     *
     * @param {Boolean} native
     * @returns {Object}
     */
    gatherProps(native = true) {
        let props = this.props,
            state = this.state,
            inputProps = {
                disabled: props.disabled,
                id: props.id || formatInputName(props.name),
                name: props.name,
                onChange: this.handleOnChange,
                readOnly: props.readOnly,
                required: props.required,
                value: state.value
            };

        // Native elements inherit more base functionality
        // Custom elements define their own classes and props
        if (native) {
            inputProps = {
                ...inputProps,
                className: this.formatClass(props.elementClassName, props.className, {
                    '@large': Boolean(props.large),
                    '@small': Boolean(props.small),
                    ['@' + state.type]: true,
                    ...this.gatherStateClasses()
                }),
                ...this.inheritNativeProps(props)
            };
        }

        switch (state.type) {
            // Add specific props and append a value to the ID
            case 'checkbox':
            case 'radio':
            case 'switch':
                inputProps.type = state.type;
                inputProps.checked = state.checked;
                inputProps.multiple = props.multiple;

                if (!props.id && (props.multiple || state.type === 'radio')) {
                    inputProps.id += '-' + state.value;
                }
                break;

            // These aren't native HTML inputs but we need to catch them
            case 'select':
                inputProps.multiple = props.multiple;
                break;

            case 'textarea':
                break;

            // Only include the type on true input elements
            default:
                inputProps.type = props.type;
                break;
        }

        return inputProps;
    }

    /**
     * Gather a list of possible CSS class names based on the standard input HTML attributes.
     *
     * @returns {Object}
     */
    gatherStateClasses() {
        let props = this.props;

        return {
            'is-checked': this.state.checked,
            'is-disabled': props.disabled,
            'is-multiple': props.multiple,
            'is-read-only': props.readOnly,
            'is-required': props.required
        };
    }

    /**
     * Return true if the input element is a radio or checkbox.
     *
     * @returns {Boolean}
     */
    isChoiceType() {
        return ['checkbox', 'radio', 'switch'].includes(this.state.type);
    }

    /**
     * Handler that updates the input value or checked state.
     */
    @bind
    handleOnChange(e) {
        let newState = {};

        if (this.isChoiceType()) {
            newState.checked = !this.state.checked;
        } else {
            newState.value = e.target.value;
        }

        this.setState(newState);
    }

    /**
     * Render the input with the props gathered from its declaration.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <input {...this.gatherProps()} />
        );
    }
}
