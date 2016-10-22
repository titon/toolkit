/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import MODULE from './module';

export const shape = Object.freeze({
  checkedValue: PropTypes.string.isRequired,
  inputID: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  selectValue: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
});

export default {
  [MODULE.contextKey]: PropTypes.shape(shape).isRequired,
};
