/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children } from 'react';
import Component from '../../Component';
import Menu from './Menu';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Item extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    /**
     * Render the drop item.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            nested = Children.toArray(props.children)
                .some(node => node.type && node.type === Menu);

        return (
            <li
                className={this.formatChildClass('item', {
                    'has-children': nested
                })}
                aria-haspopup={nested}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </li>
        );
    }

}
