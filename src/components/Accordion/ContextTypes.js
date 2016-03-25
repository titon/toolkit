/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

const CONTEXT_TYPES = {
    activeIndices: PropTypes.arrayOf(PropTypes.number),
    hideItem: PropTypes.func,
    isItemActive: PropTypes.func,
    isItemCollapsible: PropTypes.func,
    showItem: PropTypes.func,
    toggleItem: PropTypes.func,
    uid: PropTypes.string
};

export default CONTEXT_TYPES;
