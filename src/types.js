/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import type { Element } from 'react';

// React

export type ReactChildren = ?Element<any>;

// Types

export type Callback = ?() => void;

export type ClassNameMap = { [key: string]: string };

export type MotionConfig = {
  stiffness?: number,
  damping?: number,
  precision?: number,
};

export type PrimitiveType = string | number | boolean;

export type StyleDeclaration = { [key: string]: PrimitiveType };

// PropTypes

export type InputPropTypes = {
  defaultChecked?: boolean,
  defaultValue?: string,
  disabled?: boolean,
  id?: string,
  multiple?: boolean,
  onChanged?: Callback,
  onChanging?: Callback,
  readOnly?: boolean,
  required?: boolean,
};

export type ShowHidePropTypes = {
  onHidden?: Callback,
  onHiding?: Callback,
  onShowing?: Callback,
  onShown?: Callback,
};

export type SizePropTypes = {
  large?: boolean,
  small?: boolean,
};
