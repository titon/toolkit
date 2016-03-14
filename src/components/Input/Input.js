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
import formatInputName from '../../utility/formatInputName';
import invariant from '../../utility/invariant';

export default class Input extends Component {
    static defaultProps = {
        elementClassName: 'input',
        type: 'text',
        defaultValue: '',
        defaultChecked: false
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        size: PropTypes.oneOf(['small', 'large']),
        multiple: PropTypes.bool,
        defaultValue: PropTypes.string,
        defaultChecked: PropTypes.oneOfType(PropTypes.string, PropTypes.bool),
        onChanging: collection.func,
        onChanged: collection.func
    };

    /**
     * Setup state.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        let defaultValue = props.defaultValue,
            defaultChecked = props.defaultChecked;

        switch (props.type) {
            case 'checkbox':
                if (props.multiple) {
                    invariant(defaultValue, 'A default value is required when using `multiple` checkboxes.');
                } else {
                    defaultValue = defaultValue || '1';
                }
                break;

            case 'radio':
                invariant(defaultValue, 'A default value is required when using radios.');

                if (typeof defaultChecked === 'string') {
                    defaultChecked = (defaultValue === defaultChecked);
                }
                break;

            default:
        }

        this.state = {
            value: defaultValue,
            checked: Boolean(defaultChecked)
        };

        this.generateUID();
    }

    /**
     * Only update if the value of the input changes.
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
        let args = this.isChoiceType() ? [nextState.checked] : [nextState.value, this.state.value];

        this.emitEvent('changing', args);
    }

    /**
     * Emit `changed` events after rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        let args = this.isChoiceType() ? [this.state.checked] : [this.state.value, prevState.value];

        this.emitEvent('changed', args);
    }

    /**
     * Gather all the props that will be passed to the input element.
     * We only need to define a few hard requirements for props,
     * as all other props can be passed through natively.
     *
     * @returns {Object}
     */
    gatherProps() {
        let props = this.props,
            state = this.state,
            componentName = this.constructor.name.toLowerCase(),
            inputProps = {
                id: props.id || formatInputName(props.name),
                name: props.name,
                value: state.value,
                className: this.formatClass(props.elementClassName, props.className, {
                    ['@' + props.size]: Boolean(props.size),
                    ['@' + componentName]: (componentName !== 'input'),
                    'is-checked': Boolean(state.checked),
                    'is-multiple': Boolean(props.multiple),
                    'is-required': Boolean(props.required),
                    'is-disabled': Boolean(props.disabled),
                    'is-read-only': Boolean(props.readOnly)
                }),
                onChange: this.handleOnChange,
                ...this.inheritNativeProps(props)
            };

        // Add checked and multiple support
        if (this.isChoiceType()) {
            inputProps.checked = state.checked;

            if (!props.id && (props.multiple || props.type === 'radio')) {
                inputProps.id += '-' + state.value;
            }
        }

        // Only include the type on input elements
        if (componentName === 'input') {
            inputProps.type = props.type;
        }

        return inputProps;
    }

    /**
     * Return true if the input element is a radio or checkbox.
     *
     * @returns {Boolean}
     */
    isChoiceType() {
        let { type } = this.props;

        return (type === 'checkbox' || type === 'radio');
    }

    /**
     * Handler that updates the input value or checked state.
     */
    @bind
    handleOnChange(e) {
        let newState = {};

        switch (this.props.type) {
            case 'checkbox':
            case 'radio':
                newState.checked = !this.state.checked;
                break;

            default:
                newState.value = e.target.value;
                break;
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
