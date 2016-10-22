/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import MODULE from './module';

export const shape = Object.freeze({
  currentPage: PropTypes.number.isRequired,
  goToPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  prevPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  uid: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});

export default {
  [MODULE.contextKey]: PropTypes.shape(shape).isRequired,
};
