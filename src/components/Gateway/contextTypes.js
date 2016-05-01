/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import MODULE from './module';

export const shape = Object.freeze({
    registerGate: PropTypes.func.isRequired,
    warpIn: PropTypes.func.isRequired,
    warpOut: PropTypes.func.isRequired
});

export default {
    [MODULE.contextKey]: PropTypes.shape(shape).isRequired
};
