/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React, { PropTypes } from 'react';
import style, { classes } from '../../styler';
import { classNamesPropType, sizeDefaults, sizePropTypes } from '../../propTypes';

import type { InputStaticProps } from './types';

export function ToolkitStatic({ children, classNames, large, small }: InputStaticProps) {
  return (
    <span
      className={classes(classNames.input, {
        [classNames.input__large]: large,
        [classNames.input__small]: small,
      })}
    >
      {children}
    </span>
  );
}

ToolkitStatic.propTypes = {
  children: PropTypes.node,
  classNames: classNamesPropType.isRequired,
  ...sizePropTypes,
};

ToolkitStatic.defaultProps = {
  ...sizeDefaults,
};

export default style({
  input: 'input-static',
  input__large: 'input-static--large',
  input__small: 'input-static--small',
})(ToolkitStatic);
