/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import style, { classes } from '../../styler';
import { classNamesPropType } from '../../propTypes';

import type { InputGroupProps } from './types';

export function ToolkitInputGroup({ children, classNames }: InputGroupProps) {
  return (
    <span className={classes(classNames.inputGroup)}>
      {children}
    </span>
  );
}

ToolkitInputGroup.propTypes = {
  children: PropTypes.node.isRequired,
  classNames: classNamesPropType.isRequired,
};

export default style({
  inputGroup: 'input-group',
})(ToolkitInputGroup);
