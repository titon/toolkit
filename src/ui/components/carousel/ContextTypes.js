/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

export const CONTEXT_TYPES = {
    uid: PropTypes.string,
    modifier: PropTypes.string,
    currentIndex: PropTypes.number,
    activeIndices: PropTypes.arrayOf(PropTypes.number),
    firstIndex: PropTypes.number,
    lastIndex: PropTypes.number,
    itemCount: PropTypes.number,
    visibleCount: PropTypes.number,
    clonedCount: PropTypes.number,
    afterAnimation: PropTypes.func,
    isItemActive: PropTypes.func,
    nextItem: PropTypes.func,
    prevItem: PropTypes.func,
    showItem: PropTypes.func,
    startCycle: PropTypes.func,
    stopCycle: PropTypes.func
};
