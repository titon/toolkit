/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React, { PropTypes } from 'react';
import style, { classes } from '../../styler';
import { classNamesPropType, sizeDefaults, sizePropTypes } from '../../propTypes';

import type { InputGroupAddonProps } from './types';

export function ToolkitInputGroupAddon({
  children,
  classNames,
  large,
  small,
}: InputGroupAddonProps) {
  return (
    <span
      className={classes(classNames.addon, {
        [classNames.addon__large]: large,
        [classNames.addon__small]: small,
      })}
    >
      {children}
    </span>
  );
}

ToolkitInputGroupAddon.propTypes = {
  ...sizePropTypes,
  children: PropTypes.node.isRequired,
  classNames: classNamesPropType.isRequired,
};

ToolkitInputGroupAddon.defaultProps = {
  ...sizeDefaults,
};

export default style({
  addon: 'input-group__addon',
  addon__large: 'input-group__addon--large',
  addon__small: 'input-group__addon--small',
})(ToolkitInputGroupAddon);
