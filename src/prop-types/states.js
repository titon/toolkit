/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import Titon from '../Titon';

/**
 * A validator that checks for a specific state in the list of supported states.
 *
 * @returns {React.PropTypes.oneOf}
 */
export default PropTypes.oneOf(Titon.options.states);

