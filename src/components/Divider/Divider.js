/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint require-jsdoc: 0 */

import React, { PropTypes } from 'react';
import MODULE from './module';

export default function Divider({ children }) {
  return (
    <div role="separator" className={MODULE.classNames.default}>
      <span>{children}</span>
    </div>
  );
}

Divider.module = MODULE;

Divider.propTypes = {
  children: PropTypes.node,
};
