/**
 * @copyright   2010-2016, The Titon Project
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

  /**
   * Render the form field list wrapper.
   *
   * @returns {ReactElement}
   */
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
