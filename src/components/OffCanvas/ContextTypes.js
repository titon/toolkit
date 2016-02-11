/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

const CONTEXT_TYPES = {
    uid: PropTypes.string,
    activeSides: PropTypes.arrayOf(PropTypes.oneOf(['left', 'right'])),
    isSideActive: PropTypes.func,
    hideSide: PropTypes.func,
    showSide: PropTypes.func
};

export default CONTEXT_TYPES;
