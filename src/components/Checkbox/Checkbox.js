/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Input from '../Input/Input';
import MODULE from './module';

export default class Checkbox extends Input {
    static module = MODULE;

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
            </div>
        );
    }
}
