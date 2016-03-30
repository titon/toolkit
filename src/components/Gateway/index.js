/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Gateway from './Gateway';
import Gate from './Gate';
import CONTEXT_TYPES from './ContextTypes';

Gateway.CONTEXT_TYPES = CONTEXT_TYPES;
Gateway.Gate = Gate;

export { Gate, CONTEXT_TYPES };
export default Gateway;
