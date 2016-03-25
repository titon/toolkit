/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import SelectPropTypes from './PropTypes';

const CONTEXT_TYPES = {
    expanded: PropTypes.bool,
    hideMenu: PropTypes.func,
    inputID: PropTypes.string,
    inputName: PropTypes.string,
    mappedOptions: PropTypes.objectOf(SelectPropTypes.option),
    multiple: PropTypes.bool,
    options: SelectPropTypes.optionList,
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    selectValue: PropTypes.func,
    showMenu: PropTypes.func,
    toggleMenu: PropTypes.func,
    uid: PropTypes.string
};

export default CONTEXT_TYPES;
