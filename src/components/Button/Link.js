/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import Button from './Button';

export default class Link extends Button {
  static propTypes = {
    ...Button.propTypes,
    href: PropTypes.string.isRequired,
  };
}
