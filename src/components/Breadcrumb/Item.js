/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Item extends Component {
    static defaultProps = {
        caret: '/',
        elementClassName: ['breadcrumb', 'item']
    };

    static propTypes = {
        caret: PropTypes.node,
        children: PropTypes.node.isRequired,
        className: cssClass,
        elementClassName: cssClass.isRequired
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
                <a className={this.formatClass(props.elementClassName, props.className)}
                    {...this.inheritNativeProps(props)}>
                    {props.children}
                    <span className="caret">{props.caret}</span>
                </a>
            </li>
        );
    }
}
