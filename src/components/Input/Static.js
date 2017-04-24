/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import style, { classes } from '../../styler';
import { classNamesPropType, sizeDefaults, sizePropTypes } from '../../propTypes';

import type { InputStaticProps } from './types';

export function ToolkitStatic({ children, classNames, large, small }: InputStaticProps) {
  return (
    <span
      className={classes(classNames.static, {
        [classNames.static__large]: large,
        [classNames.static__small]: small,
      })}
    >
      {children}
    </span>
  );
}

ToolkitStatic.propTypes = {
  ...sizePropTypes,
  children: PropTypes.node,
  classNames: classNamesPropType.isRequired,
};

ToolkitStatic.defaultProps = {
  ...sizeDefaults,
};

export default style({
  static: 'input-static',
  static__large: 'input-static--large',
  static__small: 'input-static--small',
})(ToolkitStatic);
