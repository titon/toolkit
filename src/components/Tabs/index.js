/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Tabs from './Tabs';
import Tab from './Tab';
import Nav from './Nav';
import Section from './Section';
import CONTEXT_TYPES from './ContextTypes';

Tabs.CONTEXT_TYPES = CONTEXT_TYPES;
Tabs.Tab = Tab;
Tabs.Nav = Nav;
Tabs.Section = Section;

export { Tab, Nav, Section, CONTEXT_TYPES };
export default Tabs;
