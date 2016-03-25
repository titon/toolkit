/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

const CONTEXT_TYPES = {
    activeSides: PropTypes.arrayOf(PropTypes.oneOf(['left', 'right'])),
    hideSidebar: PropTypes.func,
    isSidebarActive: PropTypes.func,
    showSidebar: PropTypes.func,
    toggleSidebar: PropTypes.func,
    uid: PropTypes.string
};

export default CONTEXT_TYPES;
