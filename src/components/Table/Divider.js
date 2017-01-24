/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class Divider extends Component {
  static module = MODULE;

  static propTypes = {
    children: PropTypes.node,
    colSpan: PropTypes.number,
  };

  render() {
    const { children, colSpan } = this.props;

    return (
      <tr className={this.formatChildClass('divider')}>
        <td colSpan={colSpan}>
          {children}
        </td>
      </tr>
    );
  }
}
