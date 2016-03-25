/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import Factory from './Factory';

const CONTEXT_TYPES = {
    factory: PropTypes.instanceOf(Factory),
    hideModal: PropTypes.func,
    uid: PropTypes.string
};

export default CONTEXT_TYPES;
