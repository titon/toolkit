/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { defaultSizeProps, sizePropTypes } from '../../propTypes';
import MODULE from './module';

export default class Static extends Component {
  static module = MODULE;

  static defaultProps = {
    ...defaultSizeProps,
  };

  static propTypes = {
    children: PropTypes.node,
    ...sizePropTypes,
  };

  /**
   * Render a static text input element.
   *
   * @returns {ReactElement}
   */
  render() {
    const { children, large, small } = this.props;

    return (
      <span
        className={this.formatChildClass('static', {
          '@large': large,
          '@small': small,
        })}
      >
        {children}
      </span>
    );
  }
}
