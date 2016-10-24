/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Input from '../Input/Input';
import { defaultInputProps, inputPropTypes } from '../../propTypes';
import MODULE from './module';

export default class Switch extends Input {
  static module = MODULE;

  static defaultProps = {
    ...defaultInputProps,
    stacked: false,
  };

  static propTypes = {
    ...inputPropTypes,
    labelOff: PropTypes.string,
    labelOn: PropTypes.string,
    stacked: PropTypes.bool,
  };

  render() {
    const { disabled, labelOn, labelOff } = this.props;
    const inputProps = this.gatherProps(false);
    const stateClasses = this.gatherStateClasses();

    // Force back to a checkbox
    inputProps.type = 'checkbox';

    return (
      <span
        id={this.formatID('switch', inputProps.id)}
        className={this.formatClass(stateClasses)}
        aria-checked={this.state.checked}
        aria-disabled={disabled}
      >
        <input {...inputProps} />

        <label
          htmlFor={inputProps.id}
          className={this.formatChildClass('bar', stateClasses)}
          data-switch-on={labelOn}
          data-switch-off={labelOff}
        >
          <span className={this.formatChildClass('toggle')} />
        </label>
      </span>
    );
  }
}
