/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import SelectPropTypes from './PropTypes';

const CONTEXT_TYPES = {
    uid: PropTypes.string,
    multiple: PropTypes.bool,
    expanded: PropTypes.bool,
    inputID: PropTypes.string,
    inputName: PropTypes.string,
    options: SelectPropTypes.optionList,
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    selectValue: PropTypes.func,
    hideMenu: PropTypes.func,
    showMenu: PropTypes.func,
    toggleMenu: PropTypes.func
};

export default CONTEXT_TYPES;
