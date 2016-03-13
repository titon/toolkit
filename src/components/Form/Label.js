/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Label extends Component {
    static defaultProps = {
        elementClassName: ['field', 'label']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        inputID: PropTypes.string.isRequired
    };

    /**
     * Render the form field label.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <label
                id={props.inputID + '-label'}
                htmlFor={props.inputID}
                className={this.formatClass(props.elementClassName, props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </label>
        );
    }
}
