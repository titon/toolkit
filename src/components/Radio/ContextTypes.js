/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

const CONTEXT_TYPES = {
    inputName: PropTypes.string,
    checkedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectValue: PropTypes.func
};

export default CONTEXT_TYPES;
