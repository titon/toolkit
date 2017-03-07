/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/* eslint-disable no-undef */

import type { Element } from 'react';

// React

export type ReactChildren = ?Element<any>;

// Types

export type Callback = () => void;

export type HandlerEvent = {
  preventDefault: () => void,
  stopPropagation: () => void,
  // Flow event types are incomplete
  target: {
    checked: boolean,
    name: string,
    selectedOptions: NodeList<HTMLOptionElement>,
    value: string,
  },
};

export type Handler = (event: HandlerEvent) => void;

export type ClassNameMap = { [key: string]: string };

export type MotionConfig = {
  stiffness?: number,
  damping?: number,
  precision?: number,
};

export type PrimitiveType = string | number | boolean;

export type StyleDeclaration = { [key: string]: PrimitiveType };

// Components

export type PropValue = string | string[] | number | number[] | boolean | Callback | Handler;

export type PropsMap = {
  [key: string]: PropValue,
};

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

// Decorators

export type Descriptor = {
  writable?: boolean,
  enumerable?: boolean,
  configurable?: boolean,
  value?: any,
  get?: () => any,
  set?: (any) => void,
};

export type DecoratorTarget = Function | Class<*>;

export type MethodDecorator = (
  target: DecoratorTarget,
  name: string,
  descriptor: Descriptor,
) => Descriptor;

export type ClassDecorator = (target: DecoratorTarget) => DecoratorTarget;
