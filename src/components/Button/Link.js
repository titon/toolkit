/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Button from './Button';

export default class Link extends Button {
  static propTypes = {
    ...Button.propTypes,
    href: PropTypes.string.isRequired,
  };
}
