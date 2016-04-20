/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import Titon from '../Titon';

/**
 * A prop type for a list of positions on the x and y axis.
 *
 * @returns {React.PropTypes.oneOf}
 */
export const axisPositions = PropTypes.oneOf(['top', 'bottom', 'left', 'right']);

/**
 * A prop type for a list of positions in each direction.
 *
 * @returns {React.PropTypes.oneOf}
 */
export const positions = PropTypes.oneOf([
    'top-left', 'top', 'top-right', 'left', 'right',
    'bottom-left', 'bottom', 'bottom-right'
]);

/**
 * A prop type for a list of configurable states.
 *
 * @returns {React.PropTypes.oneOf}
 */
export const states = PropTypes.oneOf(Titon.options.states);
