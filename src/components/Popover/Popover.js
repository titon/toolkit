/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Tooltip from '../Tooltip';

export default class Popover extends Tooltip {
    static defaultProps = {
        position: 'top',
        type: 'popover',
        xOffset: 0,
        yOffset: 0
    };
}
