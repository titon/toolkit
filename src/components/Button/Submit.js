/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Button from './Button';

const Submit = Button.extendStyles({}, {
  styleName: 'ToolkitSubmitButton',
});

Submit.defaultProps.type = 'submit';

export default Submit;
