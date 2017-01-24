/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { defaultSizeProps, sizePropTypes } from '../../propTypes';
import MODULE from './module';

export default class Choice extends Component {
  static module = MODULE;

  static defaultProps = {
    ...defaultSizeProps,
  };

  static propTypes = {
    ...sizePropTypes,
    children: PropTypes.node,
    inputID: PropTypes.string.isRequired,
  };

  render() {
    const { children, large, small, inputID } = this.props;

    return (
      <label
        htmlFor={inputID}
        className={this.formatChildClass('choice', {
          '@large': large,
          '@small': small,
        })}
      >
        {children}
      </label>
    );
  }
}
