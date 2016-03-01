/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

const CONTEXT_TYPES = {
    uid: PropTypes.string,
    activeIndex: PropTypes.number,
    hideSection: PropTypes.func,
    showSection: PropTypes.func,
    toggleSection: PropTypes.func,
    isSectionCollapsible: PropTypes.func,
    isSectionActive: PropTypes.func
};

export default CONTEXT_TYPES;
