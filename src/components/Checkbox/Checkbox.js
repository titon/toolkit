/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Input from '../Input/Input';
import cssClass from '../../prop-types/cssClass';
import { defaultProps, propTypes } from '../Input/PropTypes';

export default class Checkbox extends Input {
    static defaultProps = {
        ...defaultProps,
        elementClassName: 'checkbox',
        toggleClassName: ['checkbox', 'toggle']
    };

    static propTypes = {
        ...propTypes,
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        toggleClassName: cssClass.isRequired
    };

    /**
     * Render the custom checkbox.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            inputProps = this.gatherProps(false),
            stateClasses = this.gatherStateClasses();

        return (
            <div
                id={this.formatID('checkbox', inputProps.id)}
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
