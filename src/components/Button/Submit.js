/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { ToolkitButton, CLASSES } from './Button';
import style from '../../styler';

export class ToolkitSubmit extends ToolkitButton {
  static defaultProps = {
    ...ToolkitButton.defaultProps,
    type: 'submit',
  };
}

export default style(CLASSES)(ToolkitSubmit);
