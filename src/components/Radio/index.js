/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Radio from './Radio';
import Group from './Group';
import CONTEXT_TYPES from './ContextTypes';

Radio.CONTEXT_TYPES = CONTEXT_TYPES;
Radio.Group = Group;

export { Group, CONTEXT_TYPES };
export default Radio;
