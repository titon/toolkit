/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from '../../Component';
import Menu from './Menu';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Item extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['drop', 'item']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired
    };

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
                className={this.formatClass(props.elementClassName, props.className, {
                    'has-children': nested
                })}
                aria-haspopup={nested}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </li>
        );
    }

}
