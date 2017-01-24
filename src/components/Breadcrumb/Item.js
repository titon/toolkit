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

  static propTypes = {
    caret: PropTypes.node,
    children: PropTypes.node.isRequired,
  };

  render() {
    const props = this.props;

    return (
      <li>
        <a className={this.formatChildClass('item')}>
          {props.children}
          <span className="caret">{props.caret || '/'}</span>
        </a>
      </li>
    );
  }
}
