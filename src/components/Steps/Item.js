/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class Item extends Component {
  static module = MODULE;

  static defaultProps = {
    complete: false,
  };

  static propTypes = {
    children: PropTypes.node,
    complete: PropTypes.bool,
  };

  render() {
    const { children, complete } = this.props;

    return (
      <li>
        <button
          type="button"
          role="button"
          className={this.formatChildClass('item', {
            'is-complete': complete,
          })}
        >
          {children}
        </button>
      </li>
    );
  }
}
