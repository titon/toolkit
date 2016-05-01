/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

export default Object.freeze({
    activeSides: PropTypes.arrayOf(PropTypes.oneOf(['left', 'right'])).isRequired,
    hideSidebar: PropTypes.func.isRequired,
    isSidebarActive: PropTypes.func.isRequired,
    showSidebar: PropTypes.func.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    uid: PropTypes.string.isRequired
});
