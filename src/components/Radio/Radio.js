/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Input from '../Input/Input';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import { defaultProps, propTypes } from '../Input/PropTypes';
import CONTEXT_TYPES from './ContextTypes';

export default class Radio extends Input {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        ...defaultProps,
        elementClassName: 'radio',
        toggleClassName: ['radio', 'toggle']
    };

    static propTypes = {
        ...propTypes,
        children: PropTypes.node,
        className: cssClass,
        defaultValue: PropTypes.string.isRequired,
        elementClassName: cssClass.isRequired,
        name: PropTypes.string,
        toggleClassName: cssClass.isRequired
    };

    /**
     * Verify checked state using the context.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super(props);

        if (context.checkedValue === props.defaultValue) {
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
            checked: (nextContext.checkedValue === this.state.value)
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
        this.context.selectValue(this.state.value);
    }

    /**
     * Render the custom radio.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            inputProps = this.gatherProps(false),
            stateClasses = this.gatherStateClasses();

        // We need to reset these values as we can't pass them through the constructor
        inputProps.name = this.context.inputName;
        inputProps.id = this.context.inputID + '-' + props.defaultValue;

        return (
            <div
                id={this.formatID('radio', inputProps.id)}
                className={this.formatClass(props.elementClassName, props.className, stateClasses)}
                aria-checked={this.state.checked}
                aria-disabled={props.disabled}
                {...this.inheritNativeProps(props)}>

                <input {...inputProps} />

                <label
                    htmlFor={inputProps.id}
                    className={this.formatClass(props.toggleClassName, stateClasses)} />

                {props.children}
            </div>
        );
    }
}
