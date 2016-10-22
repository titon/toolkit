/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import { default as BaseGate } from '../Gateway/Gate';
import Modal from './Modal';
import MODULE from './module';

export default class Gate extends BaseGate {
  static module = MODULE;

  static defaultProps = {
    ...BaseGate.defaultProps,
    contract: Modal,
  };

  static propTypes = {
    ...BaseGate.propTypes,
    animation: PropTypes.oneOf([
      'fade', 'from-above', 'from-below', 'slide-in-top',
      'slide-in-bottom', 'slide-in-left', 'slide-in-right',
    ]),
  };
}
