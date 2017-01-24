/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class Body extends Component {
  static module = MODULE;

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div
        id={this.formatID('modal-content')}
        className={this.formatChildClass('body')}
      >
        {this.props.children}
      </div>
    );
  }
}
