/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class InputGroup extends Component {
  static module = MODULE;

  render() {
    const props = this.props;

    return (
      <span className={this.formatClass()}>
        {props.children}
      </span>
    );
  }
}
