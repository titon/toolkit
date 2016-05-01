/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import MODULE from './module';

export const shape = Object.freeze({
    activeIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
    hideItem: PropTypes.func.isRequired,
    isItemActive: PropTypes.func.isRequired,
    isItemCollapsible: PropTypes.func.isRequired,
    showItem: PropTypes.func.isRequired,
    toggleItem: PropTypes.func.isRequired,
    uid: PropTypes.string.isRequired
});

export default {
    [MODULE.contextKey]: PropTypes.shape(shape).isRequired
};
