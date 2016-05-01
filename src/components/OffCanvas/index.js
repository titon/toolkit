/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import OffCanvas from './OffCanvas';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
import Toggle from './Toggle';

OffCanvas.MainContent = MainContent;
OffCanvas.Sidebar = Sidebar;
OffCanvas.Toggle = Toggle;

export { MainContent, Sidebar, Toggle };
export default OffCanvas;
