/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import { optionShape, optionList } from '../Input/propTypes';

export default Object.freeze({
    expanded: PropTypes.bool.isRequired,
    hideMenu: PropTypes.func.isRequired,
    inputID: PropTypes.string.isRequired,
    inputName: PropTypes.string.isRequired,
    mappedOptions: PropTypes.objectOf(optionShape).isRequired,
    multiple: PropTypes.bool.isRequired,
    options: optionList.isRequired,
    selectValue: PropTypes.func.isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    showMenu: PropTypes.func.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    uid: PropTypes.string.isRequired
});
