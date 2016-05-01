/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children } from 'react';
import Component from '../Component';
import MODULE from './module';

export default class FieldList extends Component {
    static module = MODULE;

    /**
     * Render the form field list wrapper.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <ol
                className={this.formatChildClass('field-list')}
                {...this.inheritNativeProps(props)}
            >
                {Children.map(props.children, child => (
                    <li>{child}</li>
                ))}
            </ol>
        );
    }
}
