/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Item extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
  };

  render() {
    const { children, index } = this.props;
    const active = this.getContext().isItemActive(index);

    return (
      <li
        role="tabpanel"
        id={this.formatID('carousel-item', index)}
        className={this.formatChildClass('item', {
          'is-active': active,
        })}
        aria-hidden={!active}
      >
        {children}
      </li>
    );
  }
}
