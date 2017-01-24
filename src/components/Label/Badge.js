/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { defaultSizeProps, sizePropTypes, states } from '../../propTypes';
import MODULE from './module';

export default class Badge extends Component {
  static module = MODULE;

  static defaultProps = {
    ...defaultSizeProps,
  };

  static propTypes = {
    ...sizePropTypes,
    children: PropTypes.string,
    state: states,
  };

  render() {
    const props = this.props;

    return (
      <span
        className={this.formatClass({
          '@badge': true,
          '@large': props.large,
          '@small': props.small,
          [`@${props.state}`]: props.state,
        })}
      >
        {props.children}
      </span>
    );
  }
}
