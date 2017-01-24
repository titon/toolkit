/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import { default as BaseGate } from '../Gateway/Gate';
import Tooltip from './Tooltip';
import MODULE from './module';

export default class Gate extends BaseGate {
  static module = MODULE;

  static defaultProps = {
    ...BaseGate.defaultProps,
    contract: Tooltip,
  };

  static propTypes = {
    ...BaseGate.propTypes,
    animation: PropTypes.oneOf(['fade', 'from-above', 'from-below', 'flip-rotate']),
  };
}
