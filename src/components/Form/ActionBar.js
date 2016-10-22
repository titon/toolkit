/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class ActionBar extends Component {
  static module = MODULE;

  static propTypes = {
    children: PropTypes.node,
  };

  /**
   * Render the form action bar.
   *
   * @returns {ReactElement}
   */
  render() {
    return (
      <div className={this.formatChildClass('actions')}>
        {this.props.children}
      </div>
    );
  }
}
