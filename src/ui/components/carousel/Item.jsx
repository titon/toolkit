/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { CONTEXT_TYPES } from './ContextTypes';

export default class Item extends Component {
    render() {
        let index = this.props.index,
            active = this.context.isItemActive(index);

        return (
            <li role="tabpanel"
                id={this.formatID('carousel-item', index)}
                className={this.formatClass(this.props.className, {
                    'is-active': active
                })}
                aria-hidden={!active}>

                {this.props.children}
            </li>
        );
    }
}

Item.contextTypes = CONTEXT_TYPES;

Item.defaultProps = {
    className: 'carousel-item',
    index: -1
};

Item.propTypes = {
    className: PropTypes.string,
    index: PropTypes.number.isRequired
};
