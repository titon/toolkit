/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

const CONTEXT_TYPES = {
    activeIndices: PropTypes.arrayOf(PropTypes.number),
    afterAnimation: PropTypes.func,
    currentIndex: PropTypes.number,
    firstIndex: PropTypes.number,
    infiniteScroll: PropTypes.bool,
    isItemActive: PropTypes.func,
    itemCount: PropTypes.number,
    lastIndex: PropTypes.number,
    loopedScroll: PropTypes.bool,
    modifier: PropTypes.string,
    nextItem: PropTypes.func,
    prevItem: PropTypes.func,
    showItem: PropTypes.func,
    startCycle: PropTypes.func,
    stopCycle: PropTypes.func,
    uid: PropTypes.string,
    visibleCount: PropTypes.number
};

export default CONTEXT_TYPES;
