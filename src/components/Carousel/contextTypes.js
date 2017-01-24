/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import MODULE from './module';

export const shape = Object.freeze({
  activeIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  afterAnimation: PropTypes.func.isRequired,
  animation: PropTypes.string.isRequired,
  currentIndex: PropTypes.number.isRequired,
  firstIndex: PropTypes.number.isRequired,
  infiniteScroll: PropTypes.bool.isRequired,
  isItemActive: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  lastIndex: PropTypes.number.isRequired,
  loopedScroll: PropTypes.bool.isRequired,
  nextItem: PropTypes.func.isRequired,
  prevItem: PropTypes.func.isRequired,
  showItem: PropTypes.func.isRequired,
  startCycle: PropTypes.func.isRequired,
  stopCycle: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
  visibleCount: PropTypes.number.isRequired,
});

export default {
  [MODULE.contextKey]: PropTypes.shape(shape).isRequired,
};
