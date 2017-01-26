/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Button from './Button';

export default function ToolkitSubmit({ children, ...props }) {
  return (
    <Button {...props} type="submit">
      {children}
    </Button>
  );
}

ToolkitSubmit.propTypes = {
  children: PropTypes.node,
};
