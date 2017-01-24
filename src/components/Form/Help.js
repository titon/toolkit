/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class Help extends Component {
  static module = MODULE;

  static propTypes = {
    children: PropTypes.node,
    inputID: PropTypes.string,
  };

  render() {
    const { children, inputID } = this.props;

    return (
      <div
        id={inputID ? (`${inputID}-help`) : null}
        className={this.formatChildClass('help')}
      >
        {children}
      </div>
    );
  }
}
