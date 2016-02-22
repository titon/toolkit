/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

/**
 * A validator for an option within a select input list.
 *
 * @returns {React.PropTypes.shape}
 */
export const option = PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    selectedLabel: PropTypes.string,
    description: PropTypes.string,
    disabled: PropTypes.bool
});

/**
 * A validator for an optgroup within a select input list.
 *
 * @returns {React.PropTypes.shape}
 */
export const optionGroup = PropTypes.shape({
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(option).isRequired,
    disabled: PropTypes.bool
});

/**
 * A validator for a list of options.
 *
 * @returns {React.PropTypes.arrayOf}
 */
export const optionList = PropTypes.arrayOf(PropTypes.oneOfType([
    option, optionGroup
]));

export default {
    option,
    optionList,
    optionGroup
};
