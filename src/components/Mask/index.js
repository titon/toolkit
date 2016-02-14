/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Mask from './Mask';
import Overlay from './Overlay';
import Target from './Target';
import Toggle from './Toggle';
import CONTEXT_TYPES from './ContextTypes';

Mask.CONTEXT_TYPES = CONTEXT_TYPES;
Mask.Overlay = Overlay;
Mask.Target = Target;
Mask.Toggle = Toggle;

export { Overlay, Target, Toggle, CONTEXT_TYPES };
export default Mask;
