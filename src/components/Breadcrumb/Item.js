/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class Item extends Component {
    static module = MODULE;

    static propTypes = {
        caret: PropTypes.node,
        children: PropTypes.node.isRequired
    };

    /**
     * Render the breadcrumb item link.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <li>
                <a className={this.formatChildClass('item')}
                    {...this.inheritNativeProps(props)}>
                    {props.children}
                    <span className="caret">{props.caret || '/'}</span>
                </a>
            </li>
        );
    }
}
