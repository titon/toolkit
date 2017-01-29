/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import type { ReactChildren, ClassNameMap } from '../../types';

export type ButtonGroupProps = {
  children: ReactChildren,
  classNames: ClassNameMap,
  justified: boolean,
  label: string,
  vertical: boolean,
};
