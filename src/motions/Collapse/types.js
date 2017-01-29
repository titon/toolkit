/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import type {
  ReactChildren,
  MotionConfig,
  Callback,
  StyleDeclaration,
} from '../../types';

export type CollapseProps = {
  children: ReactChildren,
  direction: 'width' | 'height',
  expanded: boolean,
  fixedAt: number,
  motion: MotionConfig,
  onRest: Callback,
  style: StyleDeclaration,
};

export type CollapseState = {
  size: number,
  calculate: boolean,
  changed: boolean,
};
