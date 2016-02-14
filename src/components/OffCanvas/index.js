/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import OffCanvas from './OffCanvas';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
import Toggle from './Toggle';
import CONTEXT_TYPES from './ContextTypes';

OffCanvas.CONTEXT_TYPES = CONTEXT_TYPES;
OffCanvas.MainContent = MainContent;
OffCanvas.Sidebar = Sidebar;
OffCanvas.Toggle = Toggle;

export { MainContent, Sidebar, Toggle, CONTEXT_TYPES };
export default OffCanvas;
