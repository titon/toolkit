/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

const CONTEXT_TYPES = {
    currentPage: PropTypes.number,
    goToPage: PropTypes.func,
    nextPage: PropTypes.func,
    prevPage: PropTypes.func,
    totalPages: PropTypes.number,
    uid: PropTypes.string,
    url: PropTypes.string
};

export default CONTEXT_TYPES;
