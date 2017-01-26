/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Button from './Button';

export default function ToolkitLink({ children, ...props }) {
  return (
    <Button {...props}>
      {children}
    </Button>
  );
}

ToolkitLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired,
};
