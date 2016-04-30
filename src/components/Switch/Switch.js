/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Input from '../Input/Input';
import cssClass from '../../prop-types/cssClass';
import { defaultProps, propTypes } from '../Input/propTypes';

export default class Switch extends Input {
    static defaultProps = {
        ...defaultProps,
        barClassName: ['switch', 'bar'],
        elementClassName: 'switch',
        stacked: false,
        toggleClassName: ['switch', 'toggle']
    };

    static propTypes = {
        ...propTypes,
        barClassName: cssClass.isRequired,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        labelOff: PropTypes.string,
        labelOn: PropTypes.string,
        stacked: PropTypes.bool,
        toggleClassName: cssClass.isRequired
    };

    /**
     * Render the custom switch using a checkbox.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            inputProps = this.gatherProps(false),
            stateClasses = this.gatherStateClasses();

        // Force back to a checkbox
        inputProps.type = 'checkbox';

        return (
            <span
                id={this.formatID('switch', inputProps.id)}
                className={this.formatClass(props.elementClassName, props.className, stateClasses)}
                aria-checked={this.state.checked}
                aria-disabled={props.disabled}
                {...this.inheritNativeProps(props)}>

                <input {...inputProps} />

                <label
                    htmlFor={inputProps.id}
                    className={this.formatClass(props.barClassName, stateClasses)}
                    data-switch-on={props.labelOn}
                    data-switch-off={props.labelOff}>

                    <span className={this.formatClass(props.toggleClassName)} />
                </label>
            </span>
        );
    }
}
