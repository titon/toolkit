/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Divider extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  render() {
    return (
      <li
        role="separator"
        className={this.formatChildClass('divider')}
      />
    );
  }

}
