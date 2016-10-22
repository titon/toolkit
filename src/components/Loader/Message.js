/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class Message extends Component {
  static module = MODULE;

  /**
   * Render the message within a loader.
   *
   * @returns {ReactElement}
   */
  render() {
    const props = this.props;

    return (
      <div className={this.formatChildClass('message')}>
        {props.children}
      </div>
    );
  }
}
