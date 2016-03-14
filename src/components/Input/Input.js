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

export default class Input extends Component {
    static defaultProps = {
        elementClassName: 'input',
        type: 'text',
        defaultValue: ''
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        size: PropTypes.oneOf(['small', 'large']),
        defaultValue: PropTypes.string,
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

        this.state = {
            value: props.defaultValue
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
        return (nextState.value !== this.state.value);
    }

    /**
     * Emit `changing` events before rendering.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     */
    componentWillUpdate(nextProps, nextState) {
        this.emitEvent('changing', [nextState.value, this.state.value]);
    }

    /**
     * Emit `changed` events after rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        this.emitEvent('changed', [this.state.value, prevState.value]);
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
            componentName = this.constructor.name.toLowerCase();

        return {
            id: props.id || formatInputName(props.name),
            name: props.name,
            type: (componentName === 'input') ? props.type : null,
            value: this.state.value,
            className: this.formatClass(props.elementClassName, props.className, {
                ['@' + props.size]: Boolean(props.size),
                ['@' + componentName]: (componentName !== 'input'),
                'is-checked': Boolean(props.checked),
                'is-multiple': Boolean(props.multiple),
                'is-required': Boolean(props.required),
                'is-disabled': Boolean(props.disabled),
                'is-read-only': Boolean(props.readOnly)
            }),
            onChange: this.handleOnChange,
            ...this.inheritNativeProps(props)
        };
    }

    /**
     * Handler that updates the input value.
     */
    @bind
    handleOnChange(e) {
        this.setState({
            value: e.target.value
        });
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
