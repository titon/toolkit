/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

import type { ButtonProps } from './types';

export default function ToolkitSubmit({ children, ...props }: ButtonProps) {
  return (
    <Button {...props} type="submit">
      {children}
    </Button>
  );
}

ToolkitSubmit.propTypes = {
  children: PropTypes.node.isRequired,
};
