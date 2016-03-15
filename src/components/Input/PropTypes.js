/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import collection from '../../prop-types/collection';

export const defaultProps = {
    defaultChecked: false,
    defaultValue: '',
    disabled: false,
    multiple: false,
    readOnly: false,
    required: false
};

export const propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    defaultChecked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    onChanging: collection.func,
    onChanged: collection.func
};

/**
 * A validator for an option within a select input list.
 *
 * @returns {React.PropTypes.shape}
 */
export const option = PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
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
