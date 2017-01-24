/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

/**
 * A function that will validate that a prop is either a single type, or an array of type.
 *
 * @param {Function} propType
 * @returns {React.PropTypes.oneOfType}
 */
function collectionOf(propType) {
  return PropTypes.oneOfType([propType, PropTypes.arrayOf(propType)]);
}

// Presets
collectionOf.number = collectionOf(PropTypes.number);
collectionOf.string = collectionOf(PropTypes.string);
collectionOf.func = collectionOf(PropTypes.func);

export default collectionOf;
