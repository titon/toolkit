/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import type { ReactChildren, ClassNameMap, Callback } from '../../types';

export type ButtonProps = {
  children: ReactChildren,
  classNames: ClassNameMap,
  disabled: boolean,
  href: string,
  large: boolean,
  onClick: Callback,
  onMouseOver: Callback,
  onMouseOut: Callback,
  small: boolean,
  type: 'button' | 'submit',
};

export type ButtonState = {
  pressed: boolean,
};
