/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/* eslint-disable import/prefer-default-export */

import type { ReactChildren, ClassNameMap, Callback, Handler } from '../../types';

export const INPUT_CLASSES = {
  input: 'input',
  input__large: 'input--large',
  input__small: 'input--small',
  input__checked: 'is-checked',
  input__disabled: 'is-disabled',
  input__invalid: 'is-invalid',
  input__multiple: 'is-multiple',
  input__readOnly: 'is-read-only',
  input__required: 'is-required',
};

export type InputValue = string | string[];

export type SelectOption = {
  disabled: boolean,
  label: string,
  value: string,
  options?: SelectOption[],
};

export type ChangedData = {
  name: string,
  value: InputValue,
  checked?: boolean,
};

export type RenderedProps = {
  checked?: boolean,
  className?: string,
  disabled: boolean,
  id: string,
  multiple?: boolean,
  name: string,
  onChange: Handler,
  readOnly: boolean,
  required: boolean,
  type?: string,
  value: InputValue,
};

export type InputProps = {
  children: ReactChildren,
  classNames: ClassNameMap,
  defaultChecked: string | boolean,
  defaultValue: InputValue,
  disabled: boolean,
  id: string,
  invalid: boolean,
  large: boolean,
  multiple: boolean,
  name: string,
  native: boolean,
  onChanged: Callback,
  onChanging: Callback,
  readOnly: boolean,
  required: boolean,
  small: boolean,
  type: string,
};

export type InputState = {
  checked: boolean,
  value: InputValue,
};

export type InputChoiceProps = {
  children: ReactChildren,
  classNames: ClassNameMap,
  inputID: string,
  large: boolean,
  small: boolean,
};

export type InputStaticProps = {
  children: ReactChildren,
  classNames: ClassNameMap,
  large: boolean,
  small: boolean,
};

export type InputSelectProps = {
  options: SelectOption[],
};
