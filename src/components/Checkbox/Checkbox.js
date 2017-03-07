/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React from 'react';
import Input from '../Input/Input';
import combineClasses from '../Input/combineClasses';
import formatID from '../../utility/formatID';
import formatInputName from '../../utility/formatInputName';
import style from '../../styler';
import { inputDefaults, inputPropTypes } from '../../propTypes';

import type { CheckboxState } from './types';
import type { InputProps, ChangedData } from '../Input/types';

export class ToolkitCheckbox extends React.Component {
  props: InputProps;
  state: CheckboxState;

  static propTypes = {
    ...inputPropTypes,
  };

  static defaultProps = {
    ...inputDefaults,
  };

  state: CheckboxState = {
    checked: false,
  };

  handleOnChanged = (data: ChangedData) => {
    this.setState({
      checked: data.checked,
    });

    this.props.onChanged(data);
  };

  render() {
    const { children, ...props } = this.props;
    const state = this.state;
    const id = props.id || formatInputName(props.name);

    return (
      <span
        id={formatID('checkbox', id)}
        className={combineClasses('checkbox', props, state)}
        aria-checked={state.checked}
        aria-disabled={props.disabled}
      >
        <Input
          {...props}
          id={id}
          type="checkbox"
          native={false}
          onChanged={this.handleOnChanged}
        />

        <label htmlFor={id} className={props.classNames.checkbox_toggle} />

        {children}
      </span>
    );
  }
}

export default style({
  checkbox: 'checkbox',
  checkbox_toggle: 'checkbox__toggle',
  checkbox__checked: 'is-checked',
  checkbox__disabled: 'is-disabled',
  checkbox__invalid: 'is-invalid',
  checkbox__multiple: 'is-multiple',
  checkbox__readOnly: 'is-read-only',
  checkbox__required: 'is-required',
})(ToolkitCheckbox);
