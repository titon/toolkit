/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint require-jsdoc: 0 */

import React, { PropTypes } from 'react';
import style, { classes } from '../../styler';
import { classStyles } from '../../propTypes';

function ToolkitDivider({ children }) {
  return (
    <div role="separator" className={this.props.classNames.default}>
      <span>{children}</span>
    </div>
  );
}

Divider.propTypes = {
  children: PropTypes.node,
  classNames: classStyles,
};

export default style()(ToolkitDivider);
