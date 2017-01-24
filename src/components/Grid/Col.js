/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint require-jsdoc: 0, react/sort-prop-types: 0, sorting/sort-object-props: 0 */

import React, { PropTypes } from 'react';
import formatClass from '../../utility/formatClass';
import inRange from '../../prop-types/inRange';
import MODULE from './module';

const SPAN_CLASSES = {
  span: 'span',
  push: 'push',
  pull: 'pull',
  xsmall: 'xs',
  xsmallPush: 'xs-push',
  xsmallPull: 'xs-pull',
  small: 'sm',
  smallPush: 'sm-push',
  smallPull: 'sm-pull',
  medium: 'md',
  mediumPush: 'md-push',
  mediumPull: 'md-pull',
  large: 'lg',
  largePush: 'lg-push',
  largePull: 'lg-pull',
  xlarge: 'xl',
  xlargePush: 'xl-push',
  xlargePull: 'xl-pull',
};

export default function Col({ children, end, ...props }) {
  const classes = {};

  Object.keys(SPAN_CLASSES).forEach((key) => {
    const span = props[key];

    if (span) {
      classes[`${SPAN_CLASSES[key]}-${span}`] = true;
    }
  });

  // End needs to be last to override any styles
  if (end) {
    classes.end = true;
  }

  return (
    <div className={formatClass(MODULE.classNames.col, classes)}>
      {children}
    </div>
  );
}

Col.module = MODULE;

Col.defaultProps = {
  end: false,
};

Col.propTypes = {
  children: PropTypes.node,

  // This is ugly, a better way?
  span: inRange.span12,
  push: inRange.span12,
  pull: inRange.span12,
  xsmall: inRange.span6,
  xsmallPush: inRange.span6,
  xsmallPull: inRange.span6,
  small: inRange.span12,
  smallPush: inRange.span12,
  smallPull: inRange.span12,
  medium: inRange.span12,
  mediumPush: inRange.span12,
  mediumPull: inRange.span12,
  large: inRange.span12,
  largePush: inRange.span12,
  largePull: inRange.span12,
  xlarge: inRange.span18,
  xlargePush: inRange.span18,
  xlargePull: inRange.span18,
  end: PropTypes.bool,
};
