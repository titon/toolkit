/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Help from './Help';
import Label from './Label';
import cssClass from '../../prop-types/cssClass';

export default class Field extends Component {
    static defaultProps = {
        elementClassName: 'field',
        invalid: false,
        required: false
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        help: PropTypes.node,
        inputID: PropTypes.string,
        invalid: PropTypes.bool,
        label: PropTypes.node,
        required: PropTypes.bool
    };

    /**
     * Render the form field list item.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <li>
                <div
                    className={this.formatClass(props.elementClassName, props.className, {
                        'is-required': props.required,
                        'is-invalid': props.invalid
                    })}
                    {...this.inheritNativeProps(props)}>

                    {props.label && (
                        <Label inputID={props.inputID}>{props.label}</Label>
                    )}

                    {props.children}

                    {props.help && (
                        <Help inputID={props.inputID}>{props.help}</Help>
                    )}
                </div>
            </li>
        );
    }
}
