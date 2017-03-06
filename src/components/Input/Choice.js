/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React, { PropTypes } from 'react';
import style, { classes } from '../../styler';
import { classNamesPropType, sizeDefaults, sizePropTypes } from '../../propTypes';

import type { InputChoiceProps } from './types';

export function ToolkitChoice({ children, classNames, large, small, inputID }: InputChoiceProps) {
  return (
    <label
      htmlFor={inputID}
      className={classes(classNames.choice, {
        [classNames.choice__large]: large,
        [classNames.choice__small]: small,
      })}
    >
      {children}
    </label>
  );
}

ToolkitChoice.propTypes = {
  ...sizePropTypes,
  children: PropTypes.node,
  classNames: classNamesPropType.isRequired,
  inputID: PropTypes.string.isRequired,
};

ToolkitChoice.defaultProps = {
  ...sizeDefaults,
};

export default style({
  choice: 'input-choice',
  choice__large: 'input-choice--large',
  choice__small: 'input-choice--small',
})(ToolkitChoice);
