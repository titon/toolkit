/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import SelectPropTypes from './PropTypes';

const CONTEXT_TYPES = {
    uid: PropTypes.string,
    inputName: PropTypes.string,
    options: SelectPropTypes.optionList,
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    selectValue: PropTypes.func,
    multiple: PropTypes.bool
};

export default CONTEXT_TYPES;
