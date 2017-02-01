/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import type { ReactChildren, ClassNameMap, Callback } from '../../types';

export type AccordionContext = {
  accordion: {
    activeIndices: number[],
    hideItem: (index: number) => void,
    isItemActive: (index: number) => boolean,
    isItemCollapsible: (index: number) => boolean,
    showItem: (index: number) => void,
    toggleItem: (index: number) => void,
    uid: string,
  },
};

export type AccordionProps = {
  children: ReactChildren,
  classNames: ClassNameMap,
  collapsible: boolean,
  defaultIndex: number,
  multiple: boolean,
};

export type AccordionState = {
  indices: Set<number>,
};

export type AccordionItemProps = {
  children: ReactChildren,
  classNames: ClassNameMap,
  header: ReactChildren,
  index: number,
  onClickHeader: Callback,
  onHidden: Callback,
  onHiding: Callback,
  onShowing: Callback,
  onShown: Callback,
};

export type AccordionItemState = {
  expanded: boolean,
};

export type AccordionHeaderProps = {
  active: boolean,
  children?: ReactChildren,
  classNames: ClassNameMap,
  index: number,
  onClick: Callback,
};

export type AccordionSectionProps = {
  children?: ReactChildren,
  classNames: ClassNameMap,
  expanded: boolean,
  index: number,
};
