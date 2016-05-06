/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Input from '../Input/Input';
import bind from '../../decorators/bind';
import { inputPropTypes } from '../../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Radio extends Input {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static propTypes = {
        ...inputPropTypes,
        children: PropTypes.node,
        defaultValue: PropTypes.string.isRequired,
        name: PropTypes.string
    };

    /**
     * Verify checked state using the context.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super(props);

        if (this.getContext(context).checkedValue === props.defaultValue) {
            this.state.checked = true;
        }
    }

    /**
     * Update the state based on the context of when a radio in the group has changed.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            checked: (this.getContext(nextContext).checkedValue === this.state.value)
        });
    }

    /**
     * We need to always update as were part of a group.
     *
     * @returns {Boolean}
     */
    shouldComponentUpdate() {
        return true;
    }

    /**
     * Handler that selects a value within the current radio group.
     */
    @bind
    handleOnChange() {
        this.getContext().selectValue(this.state.value);
    }

    /**
     * Render the custom radio.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            inputProps = this.gatherProps(false),
            stateClasses = this.gatherStateClasses(),
            { inputName, inputID } = this.getContext();

        // We need to reset these values as we can't pass them through the constructor
        inputProps.name = inputName;
        inputProps.id = inputID + '-' + props.defaultValue;

        return (
            <span
                id={this.formatID('radio', inputProps.id)}
                className={this.formatClass(stateClasses)}
                aria-checked={this.state.checked}
                aria-disabled={props.disabled}
                {...this.inheritNativeProps(props)}
            >
                <input {...inputProps} />

                <label
                    htmlFor={inputProps.id}
                    className={this.formatChildClass('toggle', stateClasses)}
                />

                {props.children}
            </span>
        );
    }
}
