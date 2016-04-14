/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Modal from './Modal';
import Gate from '../Gateway/Gate';

export default class ModalGate extends Gate {
    static defaultProps = {
        ...Gate.defaultProps,
        contract: Modal,
        gateClassName: ['modal', 'gate']
    };

    static propTypes = {
        ...Gate.propTypes,
        animation: PropTypes.oneOf([
            'fade', 'from-above', 'from-below', 'slide-in-top',
            'slide-in-bottom', 'slide-in-left', 'slide-in-right'
        ])
    };
}
