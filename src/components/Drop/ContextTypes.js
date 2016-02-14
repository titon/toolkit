/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

const CONTEXT_TYPES = {
    uid: PropTypes.string,
    expanded: PropTypes.bool,
    hideMenu: PropTypes.func,
    showMenu: PropTypes.func,
    toggleMenu: PropTypes.func
};

export default CONTEXT_TYPES;
