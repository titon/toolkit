/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Input from '../Input/Input';
import MODULE from './module';

export default class Checkbox extends Input {
  static module = MODULE;

  render() {
    const { children, disabled } = this.props;
    const inputProps = this.gatherProps(false);
    const stateClasses = this.gatherStateClasses();

    return (
      <span
        id={this.formatID('checkbox', inputProps.id)}
        className={this.formatClass(stateClasses)}
        aria-checked={this.state.checked}
        aria-disabled={disabled}
      >
        <input {...inputProps} />

        <label
          htmlFor={inputProps.id}
          className={this.formatChildClass('toggle', stateClasses)}
        />

        {children}
      </span>
    );
  }
}
