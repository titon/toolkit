/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint sorting/sort-object-props: 0, require-jsdoc: 0 */

import React, { PropTypes } from 'react';
import formatClass from '../../utility/formatClass';
import inRange from '../../prop-types/inRange';
import MODULE from './module';

const SPAN_CLASSES = {
  self: 'self',
  span: 'span',
  xsmall: 'xs',
  small: 'sm',
  medium: 'md',
  large: 'lg',
  xlarge: 'xl',
};

export default function Block({ shrink, order, grow, ...props }) {
  const classes = {};

  Object.keys(SPAN_CLASSES).forEach((key) => {
    const span = props[key];

    if (span) {
      classes[`${SPAN_CLASSES[key]}-${span}`] = true;
    }
  });

  return (
    <div
      className={formatClass(MODULE.classNames.block, classes)}
      style={{
        flexGrow: (grow >= 0) ? grow : null,
        flexShrink: (shrink >= 0) ? shrink : null,
        order: (order >= 0) ? order : null,
      }}
    >
      {props.children}
    </div>
    );
}

Block.module = MODULE;

Block.defaultProps = {
  grow: -1,
  order: -1,
  shrink: -1,
};

Block.propTypes = {
  children: PropTypes.node,
  grow: PropTypes.number,
  large: inRange.span12,
  medium: inRange.span12,
  order: PropTypes.number,
  self: PropTypes.oneOf(['top', 'left', 'bottom', 'right', 'center', 'baseline', 'stretch']),
  shrink: PropTypes.number,
  small: inRange.span12,
  span: inRange.span12,
  xlarge: inRange.span18,
  xsmall: inRange.span6,
};
