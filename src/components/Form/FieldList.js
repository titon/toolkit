/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class FieldList extends Component {
  static module = MODULE;

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <ol className={this.formatChildClass('field-list')}>
        {Children.map(children, child => (
          <li>{child}</li>
        ))}
      </ol>
    );
  }
}
