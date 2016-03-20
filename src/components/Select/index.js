/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Select from './Select';
import Menu from './Menu';
import CONTEXT_TYPES from './ContextTypes';

Select.CONTEXT_TYPES = CONTEXT_TYPES;
Select.Menu = Menu;

export { Menu, CONTEXT_TYPES };
export default Select;
