/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

/**
 * A validator that accepts a valid CSS class name, in 1 of 3 formats.
 * Either supports a literal string, or an array or object for BEM structuring.
 */
const propType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.shape({
        block: PropTypes.string,
        element: PropTypes.string,
        modifier: PropTypes.string
    })
]);

/**
 * @returns {React.PropTypes.oneOfType}
 */
export default propType;
