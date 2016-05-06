/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class Head extends Component {
    static module = MODULE;

    /**
     * Render the modal inner head.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                id={this.formatID('modal-title')}
                className={this.formatChildClass('head')}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </div>
        );
    }
}
