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
        size: PropTypes.oneOf(['small', 'large']),
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
            componentName = this.constructor.name.toLowerCase();

        // Select
        if (componentName === 'select') {
            if (props.multiple) {
                defaultValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
            } else {
                defaultValue = String(defaultValue);
            }

        // Checkbox
        } else if (componentName === 'checkbox' || props.type === 'checkbox') {
            if (props.multiple) {
                invariant(defaultValue,
                    'A default value is required when using `multiple` checkboxes.');
            } else {
                defaultValue = defaultValue || '1';
            }

        // Radio
        } else if (componentName === 'radio' || props.type === 'radio') {
            invariant(defaultValue, 'A default value is required when using radios.');

            if (typeof defaultChecked === 'string') {
                defaultChecked = (defaultValue === defaultChecked);
            }
        }

        this.state = {
            type: (componentName === 'input') ? props.type : componentName,
            value: defaultValue,
            checked: Boolean(defaultChecked)
        };

        this.generateUID();
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

        this.emitEvent('changing', args);
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

        this.emitEvent('changed', args);
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
                id: props.id || formatInputName(props.name),
                name: props.name,
                value: state.value,
                disabled: props.disabled,
                required: props.required,
                readOnly: props.readOnly,
                onChange: this.handleOnChange
            };

        // Native elements inherit more base functionality
        // Custom elements define their own classes and props
        if (native) {
            inputProps = {
                ...inputProps,
                className: this.formatClass(props.elementClassName, props.className, {
                    ['@' + props.size]: Boolean(props.size),
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
            'is-multiple': props.multiple,
            'is-required': props.required,
            'is-disabled': props.disabled,
            'is-read-only': props.readOnly
        };
    }

    /**
     * Return true if the input element is a radio or checkbox.
     *
     * @returns {Boolean}
     */
    isChoiceType() {
        return (this.state.type === 'checkbox' || this.state.type === 'radio');
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
