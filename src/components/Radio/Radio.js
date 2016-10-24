/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Input from '../Input/Input';
import bind from '../../decorators/bind';
import { inputPropTypes } from '../../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Radio extends Input {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    ...inputPropTypes,
    children: PropTypes.node,
    defaultValue: PropTypes.string.isRequired,
    name: PropTypes.string,
  };

  constructor(props, context) {
    super(props);

    if (this.getContext(context).checkedValue === props.defaultValue) {
      this.state.checked = true;
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      checked: (this.getContext(nextContext).checkedValue === this.state.value),
    });
  }

  shouldComponentUpdate() {
    return true;
  }

  @bind
  handleOnChange() {
    this.getContext().selectValue(this.state.value);
  }

  render() {
    const { children, disabled, defaultValue } = this.props;
    const { inputName, inputID } = this.getContext();
    const inputProps = this.gatherProps(false);
    const stateClasses = this.gatherStateClasses();

    // We need to reset these values as we can't pass them through the constructor
    inputProps.name = inputName;
    inputProps.id = `${inputID}-${defaultValue}`;

    return (
      <span
        id={this.formatID('radio', inputProps.id)}
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
