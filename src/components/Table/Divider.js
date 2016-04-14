/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Divider extends Component {
    static defaultProps = {
        elementClassName: ['table', 'divider']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        colSpan: PropTypes.number,
        elementClassName: cssClass.isRequired
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
                className={this.formatClass(props.elementClassName, props.className)}
                {...this.inheritNativeProps(props)}>

                <td colSpan={props.colSpan}>
                    {props.children}
                </td>
            </tr>
        );
    }
}
