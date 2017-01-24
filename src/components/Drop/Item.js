/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from '../../Component';
import Menu from './Menu';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Item extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;
    const nested = Children.toArray(children).some(node => node.type && node.type === Menu);

    return (
      <li
        className={this.formatChildClass('item', {
          'has-children': nested,
        })}
        aria-haspopup={nested}
      >
        {children}
      </li>
    );
  }

}
