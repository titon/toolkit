/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import collection from '../../prop-types/collection';

/**
 * Common default props between Input components.
 *
 * @type {Object}
 */
export const defaultProps = {
    defaultChecked: false,
    defaultValue: '',
    disabled: false,
    multiple: false,
    readOnly: false,
    required: false
};

/**
 * Common prop types between Input components.
 *
 * @type {Object}
 */
export const propTypes = {
    defaultChecked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    multiple: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onChanged: collection.func,
    onChanging: collection.func,
    readOnly: PropTypes.bool,
    required: PropTypes.bool
};

/**
 * A validator for an option within a select input list.
 *
 * @returns {React.PropTypes.shape}
 */
export const option = PropTypes.shape({
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
});

/**
 * A validator for an optgroup within a select input list.
 *
 * @returns {React.PropTypes.shape}
 */
export const optionGroup = PropTypes.shape({
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(option).isRequired
});

/**
 * A validator for a list of options.
 *
 * @returns {React.PropTypes.arrayOf}
 */
export const optionList = PropTypes.arrayOf(PropTypes.oneOfType([
    option, optionGroup
]));
