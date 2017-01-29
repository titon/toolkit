/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import { PropTypes } from 'react';

export default PropTypes.shape({
  activeIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  hideItem: PropTypes.func.isRequired,
  isItemActive: PropTypes.func.isRequired,
  isItemCollapsible: PropTypes.func.isRequired,
  showItem: PropTypes.func.isRequired,
  toggleItem: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
});
