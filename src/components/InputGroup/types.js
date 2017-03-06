/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import type { ReactChildren, ClassNameMap } from '../../types';

export type InputGroupProps = {
  children: ReactChildren,
  classNames: ClassNameMap,
};

export type InputGroupAddonProps = {
  children: ReactChildren,
  classNames: ClassNameMap,
  large: boolean,
  small: boolean,
};
