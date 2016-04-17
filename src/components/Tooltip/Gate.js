/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Tooltip from './Tooltip';
import Gate from '../Gateway/Gate';

export default class TooltipGate extends Gate {
    static defaultProps = {
        ...Gate.defaultProps,
        contract: Tooltip,
        gateClassName: ['tooltip', 'gate']
    };

    static propTypes = {
        ...Gate.propTypes,
        animation: PropTypes.oneOf(['fade', 'from-above', 'from-below', 'flip-rotate'])
    };
}
