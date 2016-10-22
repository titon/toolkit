/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { defaultSizeProps, sizePropTypes } from '../../propTypes';
import MODULE from './module';

export default class Addon extends Component {
  static module = MODULE;

  static defaultProps = {
    ...defaultSizeProps,
  };

  static propTypes = {
    ...sizePropTypes,
    children: PropTypes.node,
  };

    /**
     * Render the inline input group add-on.
     *
     * @returns {ReactElement}
     */
  render() {
    const props = this.props;

    return (
      <span
        className={this.formatChildClass('addon', {
          '@large': props.large,
          '@small': props.small,
        })}
        {...this.inheritNativeProps(props)}
      >
        {props.children}
      </span>
        );
  }
}
