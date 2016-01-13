/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Accordion from './Accordion';
import Item from './Item';
import CONTEXT_TYPES from './ContextTypes';

Accordion.CONTEXT_TYPES = CONTEXT_TYPES;
Accordion.Item = Item;

export { Item, CONTEXT_TYPES };
export default Accordion;
