/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Modal from './Modal';
import { default as BaseGate } from '../Gateway/Gate';

export default class Gate extends BaseGate {
    static defaultProps = {
        ...BaseGate.defaultProps,
        contract: Modal
    };
}
