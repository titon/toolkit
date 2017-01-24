/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import { ToolkitButton, CLASSES } from './Button';
import style from '../../styler';

export class ToolkitLink extends ToolkitButton {
  static propTypes = {
    ...ToolkitButton.propTypes,
    href: PropTypes.string.isRequired,
  };
}

export default style(CLASSES)(ToolkitLink);
