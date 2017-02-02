/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/* eslint require-jsdoc: 0 */

import React, { PropTypes } from 'react';
import { ClassNamesPropTypes } from 'aesthetic';
import style, { classes } from '../../styler';

function ToolkitDivider({ children, classNames }) {
  return (
    <div role="separator" className={classNames.default}>
      <span>{children}</span>
    </div>
  );
}

ToolkitDivider.propTypes = {
  children: PropTypes.node,
  classNames: ClassNamesPropTypes
};

export default style({ default: 'default' })(ToolkitDivider);
