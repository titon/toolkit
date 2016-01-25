/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Item extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['carousel', 'item']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        index: PropTypes.number.isRequired
    };

    /**
     * Render the individual list item.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props,
            index = props.index,
            active = this.context.isItemActive(index);

        return (
            <li role="tabpanel"
                id={this.formatID('carousel-item', index)}
                className={this.formatClass(props.className, {
                    'is-active': active
                })}
                aria-hidden={!active}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </li>
        );
    }
}
