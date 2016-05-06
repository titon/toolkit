/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class Divider extends Component {
    static module = MODULE;

    static propTypes = {
        children: PropTypes.node,
        colSpan: PropTypes.number
    };

    /**
     * Render the dividing table row.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <tr
                className={this.formatChildClass('divider')}
                {...this.inheritNativeProps(props)}
            >
                <td colSpan={props.colSpan}>
                    {props.children}
                </td>
            </tr>
        );
    }
}
