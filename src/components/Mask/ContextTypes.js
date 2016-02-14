/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

const CONTEXT_TYPES = {
    uid: PropTypes.string,
    expanded: PropTypes.bool,
    hideOverlay: PropTypes.func,
    showOverlay: PropTypes.func,
    toggleOverlay: PropTypes.func
};

export default CONTEXT_TYPES;
